import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialCarMigration1758178523135 implements MigrationInterface {
  name = 'InitialCarMigration1758178523135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "car"."original_car" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "model" character varying NOT NULL, "year" integer NOT NULL, "description" text NOT NULL, "price_per_hour" numeric(10,2) NOT NULL, "capacity" integer NOT NULL, "fuel_type" character varying(50) NOT NULL DEFAULT 'Petrol', "steering" character varying(50) NOT NULL DEFAULT 'Left-hand drive', "fuel_capacity" numeric(10,2) NOT NULL DEFAULT '60', "type" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_84245dc95e4c793d99a7d6611d" CHECK ("fuel_capacity" >= 0), CONSTRAINT "CHK_e2c99d135f74786648907cf3ae" CHECK ("price_per_hour" > 0), CONSTRAINT "PK_815c3814c62d6dbf813f95e0efa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3b0298fe0ab9f060e24ab3d46f" ON "car"."original_car" ("model") `,
    );
    await queryRunner.query(
      `CREATE TABLE "car"."car_photo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "file_id" character varying, "car_id" uuid, "original_car_id" uuid, CONSTRAINT "CHK_b3a1453b8d8f389576a20e4380" CHECK ("car_id" IS NOT NULL OR "original_car_id" IS NOT NULL), CONSTRAINT "PK_2bd318cd66e558de57cb3ee38b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "car"."car" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "model" character varying NOT NULL, "year" integer NOT NULL, "description" text NOT NULL, "price_per_hour" numeric(10,2) NOT NULL, "type" character varying(50) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'available', "capacity" integer NOT NULL, "fuel_type" character varying(50) NOT NULL DEFAULT 'Petrol', "steering" character varying(50) NOT NULL DEFAULT 'Left-hand drive', "fuel_capacity" numeric(10,2) NOT NULL DEFAULT '60', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_aa3874595ebed9a440b8c3edfa" CHECK ("fuel_capacity" >= 0), CONSTRAINT "CHK_ff52301ab167ee61881606019b" CHECK ("price_per_hour" > 0), CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b269a137f817c6417e45e8542d" ON "car"."car" ("model") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5a39579c99e5a27f6b06f12df2" ON "car"."car" ("type", "capacity", "price_per_hour") `,
    );
    await queryRunner.query(
      `ALTER TABLE "car"."car_photo" ADD CONSTRAINT "FK_dd6713b9bf4fd65b8728db65f05" FOREIGN KEY ("car_id") REFERENCES "car"."car"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car"."car_photo" ADD CONSTRAINT "FK_a310450c08b5996b667b81bad74" FOREIGN KEY ("original_car_id") REFERENCES "car"."original_car"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car"."car_photo" DROP CONSTRAINT "FK_a310450c08b5996b667b81bad74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car"."car_photo" DROP CONSTRAINT "FK_dd6713b9bf4fd65b8728db65f05"`,
    );
    await queryRunner.query(
      `DROP INDEX "car"."IDX_5a39579c99e5a27f6b06f12df2"`,
    );
    await queryRunner.query(
      `DROP INDEX "car"."IDX_b269a137f817c6417e45e8542d"`,
    );
    await queryRunner.query(`DROP TABLE "car"."car"`);
    await queryRunner.query(`DROP TABLE "car"."car_photo"`);
    await queryRunner.query(
      `DROP INDEX "car"."IDX_3b0298fe0ab9f060e24ab3d46f"`,
    );
    await queryRunner.query(`DROP TABLE "car"."original_car"`);
  }
}
