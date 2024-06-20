import { CarDefaultCapacity } from '@/helpers';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesAndDescriptiveFieldToCar1718829206313
  implements MigrationInterface {
  name = 'AddIndexesAndDescriptiveFieldToCar1718829206313';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" RENAME COLUMN "requested_hours" TO "requested_days"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" ADD "capacity" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" ADD "gasoline" character varying(50) NOT NULL DEFAULT 'Petrol'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" ADD "steering" character varying(50) NOT NULL DEFAULT 'Left-hand drive'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" ADD "fuel_capacity" numeric(10,2) NOT NULL DEFAULT '60'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" ADD "capacity" integer NOT NULL`,
    );

    await queryRunner.query(`
      UPDATE "rental"."cars"
      SET "capacity" =
        CASE "type"
          WHEN 'SUV' THEN ${CarDefaultCapacity.SUV}
          WHEN 'MVP' THEN ${CarDefaultCapacity.MVP}
          WHEN 'Sport' THEN ${CarDefaultCapacity.Sport}
          WHEN 'Hatchback' THEN ${CarDefaultCapacity.Hatchback}
          WHEN 'Sedan' THEN ${CarDefaultCapacity.Sedan}
          WHEN 'Coupe' THEN ${CarDefaultCapacity.Coupe}
          WHEN 'Crossover' THEN ${CarDefaultCapacity.Crossover}
          WHEN 'Pickup' THEN ${CarDefaultCapacity.Pickup}
          WHEN 'Minivan' THEN ${CarDefaultCapacity.Minivan}
          ELSE ${CarDefaultCapacity.Sedan}
        END
    `);

    await queryRunner.query(`
      UPDATE "rental"."original_cars"
      SET "capacity" =
        CASE "type"
          WHEN 'SUV' THEN ${CarDefaultCapacity.SUV}
          WHEN 'MVP' THEN ${CarDefaultCapacity.MVP}
          WHEN 'Sport' THEN ${CarDefaultCapacity.Sport}
          WHEN 'Hatchback' THEN ${CarDefaultCapacity.Hatchback}
          WHEN 'Sedan' THEN ${CarDefaultCapacity.Sedan}
          WHEN 'Coupe' THEN ${CarDefaultCapacity.Coupe}
          WHEN 'Crossover' THEN ${CarDefaultCapacity.Crossover}
          WHEN 'Pickup' THEN ${CarDefaultCapacity.Pickup}
          WHEN 'Minivan' THEN ${CarDefaultCapacity.Minivan}
          ELSE ${CarDefaultCapacity.Sedan}
        END
    `);

    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" ADD "gasoline" character varying(50) NOT NULL DEFAULT 'Petrol'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" ADD "steering" character varying(50) NOT NULL DEFAULT 'Left-hand drive'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" ADD "fuel_capacity" numeric(10,2) NOT NULL DEFAULT '60'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" ALTER COLUMN "price_per_day" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" ALTER COLUMN "price_per_day" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3a435d8bed684aa89e973cb6c7" ON "rental"."cars" ("price_per_day") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_99b4c2e308bed8ee641baa38fd" ON "rental"."cars" ("type", "capacity", "price_per_day") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" ADD CONSTRAINT "CHK_3d421e2c2502f327fb6d9a453c" CHECK ("fuel_capacity" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" ADD CONSTRAINT "CHK_5b318121477ee1d05f88c30efe" CHECK ("price_per_day" > 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" ADD CONSTRAINT "CHK_0d09f8ccccc93832578473cd19" CHECK ("fuel_capacity" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" ADD CONSTRAINT "CHK_ec60f779cb451a38bcde657f91" CHECK ("price_per_day" > 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" DROP CONSTRAINT "CHK_ec60f779cb451a38bcde657f91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" DROP CONSTRAINT "CHK_0d09f8ccccc93832578473cd19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" DROP CONSTRAINT "CHK_5b318121477ee1d05f88c30efe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" DROP CONSTRAINT "CHK_3d421e2c2502f327fb6d9a453c"`,
    );
    await queryRunner.query(
      `DROP INDEX "rental"."IDX_99b4c2e308bed8ee641baa38fd"`,
    );
    await queryRunner.query(
      `DROP INDEX "rental"."IDX_3a435d8bed684aa89e973cb6c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" ALTER COLUMN "price_per_day" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" ALTER COLUMN "price_per_day" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" DROP COLUMN "fuel_capacity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" DROP COLUMN "steering"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" DROP COLUMN "gasoline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."original_cars" DROP COLUMN "capacity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" DROP COLUMN "fuel_capacity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" DROP COLUMN "steering"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" DROP COLUMN "gasoline"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."cars" DROP COLUMN "capacity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" RENAME COLUMN "requested_days" TO "requested_hours"`,
    );
  }
}
