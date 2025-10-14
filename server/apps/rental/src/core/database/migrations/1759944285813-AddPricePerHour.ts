import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPricePerHour1759944285813 implements MigrationInterface {
  name = 'AddPricePerHour1759944285813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" ADD "car_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" ADD "price_per_hour" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rental_outbox" ALTER COLUMN "headers" SET DEFAULT '{}'::jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental"."rental_outbox" ALTER COLUMN "headers" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" DROP COLUMN "price_per_hour"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" DROP COLUMN "car_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" DROP COLUMN "user_id"`,
    );
  }
}
