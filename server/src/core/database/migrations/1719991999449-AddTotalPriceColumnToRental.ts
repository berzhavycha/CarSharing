import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTotalPriceColumnToRental1719991999449 implements MigrationInterface {
    name = 'AddTotalPriceColumnToRental1719991999449'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rental"."rentals" ADD "total_price" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rental"."rentals" DROP COLUMN "total_price"`);
    }

}
