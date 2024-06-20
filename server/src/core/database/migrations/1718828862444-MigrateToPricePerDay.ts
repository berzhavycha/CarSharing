import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateToPricePerDay1718828862444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "rental"."cars"
            ADD "price_per_day" numeric(10,2)
        `);

    await queryRunner.query(`
            UPDATE "rental"."cars"
            SET "price_per_day" = "price_per_hour" * 24
        `);

    await queryRunner.query(`
            ALTER TABLE "rental"."cars"
            DROP COLUMN "price_per_hour"
        `);

    await queryRunner.query(`
            ALTER TABLE "rental"."original_cars"
            ADD "price_per_day" numeric(10,2)
        `);

    await queryRunner.query(`
            UPDATE "rental"."original_cars"
            SET "price_per_day" = "price_per_hour" * 24
        `);

    await queryRunner.query(`
            ALTER TABLE "rental"."original_cars"
            DROP COLUMN "price_per_hour"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "rental"."cars"
            ADD "price_per_hour" numeric(10,2)
        `);

    await queryRunner.query(`
            UPDATE "rental"."cars"
            SET "price_per_hour" = "price_per_day" / 24
        `);

    await queryRunner.query(`
            ALTER TABLE "rental"."cars"
            DROP COLUMN "price_per_day"
        `);

    await queryRunner.query(`
            ALTER TABLE "rental"."original_cars"
            ADD "price_per_hour" numeric(10,2)
        `);

    await queryRunner.query(`
            UPDATE "rental"."original_cars"
            SET "price_per_hour" = "price_per_day" / 24
        `);

    await queryRunner.query(`
            ALTER TABLE "rental"."original_cars"
            DROP COLUMN "price_per_day"
        `);
  }
}
