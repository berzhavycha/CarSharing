import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRentalSchema1718260472745 implements MigrationInterface {
  name = 'AddRentalSchema1718260472745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS rental`);
    await queryRunner.query(
      `CREATE TABLE "rental"."cars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image_url" character varying NOT NULL, "model" character varying NOT NULL, "year" integer NOT NULL, "description" text NOT NULL, "price_per_hour" numeric(10,2) NOT NULL, "type" character varying(50) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'available', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_9f3f8a3ec88ed1b7cb4f666b53" CHECK ("price_per_hour" > 0), CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rental"."original_cars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image_url" character varying NOT NULL, "model" character varying NOT NULL, "year" integer NOT NULL, "description" text NOT NULL, "price_per_hour" numeric(10,2) NOT NULL, "type" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_9a963ee2fa73bb27bfa9d25239" CHECK ("price_per_hour" > 0), CONSTRAINT "PK_006817a7bbe7f080c48d4486c79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rental"."rentals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rental_start" TIMESTAMP NOT NULL DEFAULT now(), "rental_end" TIMESTAMP NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "car_id" uuid, "original_car_id" uuid, CONSTRAINT "CHK_251599d808d8f61a18ce8ff3bb" CHECK ("rental_start" < "rental_end"), CONSTRAINT "PK_2b10d04c95a8bfe85b506ba52ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ALTER COLUMN "balance" TYPE numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" ADD CONSTRAINT "FK_b13ac8580bd6a011f47a476fbad" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" ADD CONSTRAINT "FK_243d136cb7fd3e65b4630fe6bf9" FOREIGN KEY ("car_id") REFERENCES "rental"."cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" ADD CONSTRAINT "FK_348cdfbafe36388e2dba8f1b83b" FOREIGN KEY ("original_car_id") REFERENCES "rental"."original_cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" DROP CONSTRAINT "FK_348cdfbafe36388e2dba8f1b83b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" DROP CONSTRAINT "FK_243d136cb7fd3e65b4630fe6bf9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" DROP CONSTRAINT "FK_b13ac8580bd6a011f47a476fbad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ALTER COLUMN "balance" TYPE numeric`,
    );
    await queryRunner.query(`DROP TABLE "rental"."rentals"`);
    await queryRunner.query(`DROP TABLE "rental"."original_cars"`);
    await queryRunner.query(`DROP TABLE "rental"."cars"`);
    await queryRunner.query(`DROP SCHEMA rental`);
  }
}
