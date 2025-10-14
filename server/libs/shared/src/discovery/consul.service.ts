import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ConsulService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ConsulService.name);
  private serviceId: string;

  private readonly consulHost: string;
  private readonly consulPort: string;
  private readonly serviceHost: string;

  constructor(private readonly configService: ConfigService) {
    this.consulHost = this.configService.get<string>('CONSUL_HOST', 'localhost');
    this.consulPort = this.configService.get<string>('CONSUL_PORT', '8500');
    this.serviceHost = this.configService.get<string>('SERVICE_HOST', 'localhost');
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('ConsulService initialized');

    const name = this.configService.get<string>('SERVICE_NAME', 'unknown-service');
    const port = parseInt(
      this.configService.get<string>('PORT', process.argv[2] ?? '3000'),
      10,
    );

    this.serviceId = `${name}-${port}`;

    await this.registerService(name, port);
  }

  async onModuleDestroy(): Promise<void> {
    await this.deregisterService();
  }

  private async registerService(name: string, port: number): Promise<void> {
    const payload = {
      ID: this.serviceId,
      Name: name,
      Address: this.serviceHost,
      Port: port,
      Check: {
        HTTP: `http://${this.serviceHost}:${port}/health`,
        Interval: '10s',
      },
    };

    this.logger.log(`Registering ${name} (${this.serviceId}) on port ${port}`);

    try {
      const res = await axios.put(
        `http://${this.consulHost}:${this.consulPort}/v1/agent/service/register`,
        payload,
      );
      this.logger.log(`${name} registered successfully`, res.data);
    } catch (err) {
      this.logger.error(`Failed to register ${name}: ${err.message}`);
    }
  }

  private async deregisterService(): Promise<void> {
    if (!this.serviceId) return;

    this.logger.log(`Deregistering service ${this.serviceId}`);
    try {
      await axios.put(
        `http://${this.consulHost}:${this.consulPort}/v1/agent/service/deregister/${this.serviceId}`,
      );
      this.logger.log(`Service ${this.serviceId} deregistered successfully`);
    } catch (err) {
      this.logger.error(`Failed to deregister service: ${err.message}`);
    }
  }

  async discover(serviceName: string): Promise<string> {
    try {
      const { data } = await axios.get(
        `http://${this.consulHost}:${this.consulPort}/v1/catalog/service/${serviceName}`,
      );

      if (!data.length) {
        throw new Error(`No instances found for ${serviceName}`);
      }

      const instance = data[0];
      return `http://${instance.Address}:${instance.ServicePort}`;
    } catch (err) {
      this.logger.error(`Discovery failed for ${serviceName}: ${err.message}`);
      throw err;
    }
  }
}
