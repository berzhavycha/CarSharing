import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateBackToHourlyPricing1718884532173
  implements MigrationInterface
{
  name = 'MigrateBackToHourlyPricing1718884532173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "rental"."IDX_3a435d8bed684aa89e973cb6c7"`,
    );
    await queryRunner.query(
      `DROP INDEX "rental"."IDX_99b4c2e308bed8ee641baa38fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" DROP CONSTRAINT "CHK_5b318121477ee1d05f88c30efe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" DROP CONSTRAINT "CHK_ec60f779cb451a38bcde657f91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" RENAME COLUMN "requested_days" TO "requested_hours"`,
    );
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
            ALTER COLUMN "price_per_hour" SET NOT NULL
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
            ALTER TABLE "rental"."original_cars"
            ALTER COLUMN "price_per_hour" SET NOT NULL
        `);

    await queryRunner.query(`
            UPDATE "rental"."original_cars"
            SET "price_per_hour" = "price_per_day" / 24
        `);

    await queryRunner.query(`
            ALTER TABLE "rental"."original_cars"
            DROP COLUMN "price_per_day"
        `);
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" DROP COLUMN "gasoline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" DROP COLUMN "gasoline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" ADD "fuel_type" character varying(50) NOT NULL DEFAULT 'Petrol'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" ADD "fuel_type" character varying(50) NOT NULL DEFAULT 'Petrol'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_34c23a0540835530da754d5bc3" ON "rental"."cars" ("type", "capacity", "price_per_hour") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" ADD CONSTRAINT "CHK_9f3f8a3ec88ed1b7cb4f666b53" CHECK ("price_per_hour" > 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" ADD CONSTRAINT "CHK_9a963ee2fa73bb27bfa9d25239" CHECK ("price_per_hour" > 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" DROP CONSTRAINT "CHK_9a963ee2fa73bb27bfa9d25239"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" DROP CONSTRAINT "CHK_9f3f8a3ec88ed1b7cb4f666b53"`,
    );
    await queryRunner.query(
      `DROP INDEX "rental"."IDX_34c23a0540835530da754d5bc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" DROP COLUMN "fuel_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" DROP COLUMN "fuel_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" ADD "gasoline" character varying(50) NOT NULL DEFAULT 'Petrol'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" ADD "gasoline" character varying(50) NOT NULL DEFAULT 'Petrol'`,
    );
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
            ALTER COLUMN "price_per_day" SET NOT NULL
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
            ALTER COLUMN "price_per_day" SET NOT NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "rental"."original_cars"
            DROP COLUMN "price_per_hour"
        `);
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" RENAME COLUMN "requested_hours" TO "requested_days"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" ADD CONSTRAINT "CHK_ec60f779cb451a38bcde657f91" CHECK ((price_per_day > (0)::numeric))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" ADD CONSTRAINT "CHK_5b318121477ee1d05f88c30efe" CHECK ((price_per_day > (0)::numeric))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_99b4c2e308bed8ee641baa38fd" ON "rental"."cars" ("type", "price_per_day", "capacity") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3a435d8bed684aa89e973cb6c7" ON "rental"."cars" ("price_per_day") `,
    );
  }
}
