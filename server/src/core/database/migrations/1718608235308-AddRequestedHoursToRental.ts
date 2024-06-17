import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRequestedHoursToRental1718608235308 implements MigrationInterface {
    name = 'AddRequestedHoursToRental1718608235308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rental"."rentals" ADD "requested_hours" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rental"."rentals" DROP COLUMN "requested_hours"`);
    }

}
