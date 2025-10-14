import { ConsulService } from '@app/shared/discovery/consul.service';
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import CircuitBreaker from 'opossum';
import pLimit from 'p-limit';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { QueryRentalsDto } from '../dtos/query-rentals.dto';

import { RentalsService } from './rentals.service';
import { Rental } from '../entities/rental.entity';

export interface Car {
  id: string;
  model: string;
  brand: string;
  year: number;
}

export interface Transaction {
  id: string;
  rentalId: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface CarBreakerPayload {
  url: string;
  carId: string;
  token?: string;
}

interface TransactionsBreakerPayload {
  url: string;
  rentalId: string;
  token?: string;
}

@Injectable()
export class RentalAggregatorService {
  private readonly logger = new Logger(RentalAggregatorService.name);

  private carBreaker: CircuitBreaker<[CarBreakerPayload], Car>;
  private transactionsBreaker: CircuitBreaker<
    [TransactionsBreakerPayload],
    Transaction[]
  >;

  private carLimiter = pLimit(20);
  private transactionsLimiter = pLimit(20);

  constructor(
    private readonly http: HttpService,
    private readonly consul: ConsulService,
    private readonly rentalService: RentalsService,
  ) {
    this.carBreaker = this.makeBreaker(this.callCarService.bind(this), 'Car');
    this.transactionsBreaker = this.makeBreaker(
      this.callTransactionsService.bind(this),
      'Transactions',
    );
  }

  private makeBreaker<TArgs extends unknown[], TResult>(
    fn: (...args: TArgs) => Promise<TResult>,
    name: string,
  ): CircuitBreaker<TArgs, TResult> {
    const breaker = new CircuitBreaker(fn, {
      timeout: 3000,
      errorThresholdPercentage: 50,
      resetTimeout: 10000,
    });
    breaker.on('open', () => this.logger.warn(`${name} breaker OPENED`));
    breaker.on('halfOpen', () => this.logger.log(`${name} breaker HALF-OPEN`));
    breaker.on('close', () => this.logger.log(`${name} breaker CLOSED`));
    return breaker;
  }

  async getPaginatedRentalsWithDetails(
    userId: string,
    query: QueryRentalsDto,
    token?: string,
  ): Promise<[(Rental & { car: Car; transactions: Transaction[] })[], number]> {
    try {
      const carUrl = await this.consul.discover('cars-service');
      const transactionsUrl = await this.consul.discover('payment-service');

      this.logger.debug(
        `Discovered services: car=${carUrl}, transactions=${transactionsUrl}`,
      );

      const [rentals, total] = await this.rentalService.findAllUserRentals(
        userId,
        query,
      );

      const enriched = await Promise.all(
        rentals.map(async (rental) => {
          const [car, transactions] = await Promise.all([
            this.carLimiter(() =>
              this.carBreaker.fire({ url: carUrl, carId: rental.carId, token }),
            ),
            this.transactionsLimiter(() =>
              this.transactionsBreaker.fire({
                url: transactionsUrl,
                rentalId: rental.id,
                token,
              }),
            ),
          ]);

          return { ...rental, car, transactions };
        }),
      );

      return [enriched, total];
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(`Aggregator failed: ${err.message}`, err.stack);
        throw new ServiceUnavailableException(
          'Rental aggregator unavailable: ' + err.message,
        );
      }
      throw new ServiceUnavailableException('Rental aggregator unavailable');
    }
  }

  private async callCarService({
    url,
    carId,
    token,
  }: CarBreakerPayload): Promise<Car> {
    const res = await firstValueFrom(
      this.http
        .get<Car>(`${url}/cars/${carId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .pipe(
          timeout(3000),
          catchError((err) => this.handleError(err, 'Car')),
        ),
    );
    return res.data;
  }

  private async callTransactionsService({
    url,
    rentalId,
    token,
  }: TransactionsBreakerPayload): Promise<Transaction[]> {
    const res = await firstValueFrom(
      this.http
        .get<Transaction[]>(`${url}/transactions`, {
          params: { rentalId },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .pipe(
          timeout(3000),
          catchError((err) => this.handleError(err, 'Transactions')),
        ),
    );
    return res.data;
  }

  private handleError(err: unknown, service: string): never {
    if (err instanceof TimeoutError) {
      this.logger.error(`${service} service timeout`);
      throw new Error(`${service} service timeout`);
    }
    if (err instanceof Error) {
      this.logger.error(`${service} service error: ${err.message}`);
      throw err;
    }
    throw new Error(`${service} service unknown error`);
  }
}
