import {
    IsNumber,
} from 'class-validator';

export class UpdateUserBalanceDto {
    @IsNumber()
    amount: number
}
