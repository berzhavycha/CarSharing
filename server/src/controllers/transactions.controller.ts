import {
    Controller,
    Get,
    Query,
    UseGuards,
} from '@nestjs/common';

import { QueryTransactionsDto } from '@/dtos';
import { Transaction } from '@/entities';
import { RoleGuard } from '@/guards';
import { Roles } from '@/helpers';
import { TransactionsService } from '@/services';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Get()
    @UseGuards(RoleGuard(Roles.ADMIN))
    async findAll(@Query() listTransactionsDto: QueryTransactionsDto): Promise<[Transaction[], number]> {
        return this.transactionsService.findAll(listTransactionsDto);
    }
}
