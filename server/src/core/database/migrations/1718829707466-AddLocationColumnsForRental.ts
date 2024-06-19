import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationColumnsForRental1718829707466 implements MigrationInterface {
    name = 'AddLocationColumnsForRental1718829707466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rental"."rentals" ADD "pick_up_location" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "rental"."rentals" ADD "drop_off_location" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rental"."rentals" DROP COLUMN "drop_off_location"`);
        await queryRunner.query(`ALTER TABLE "rental"."rentals" DROP COLUMN "pick_up_location"`);
    }

}
