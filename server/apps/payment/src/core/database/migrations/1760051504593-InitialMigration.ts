import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1760051504593 implements MigrationInterface {
  name = 'InitialMigration1760051504593';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "payment"."transactions_type_enum" AS ENUM('top_up', 'rental_payment', 'refund', 'penalty')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment"."transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "user_id" uuid, "rental_id" uuid, "description" text, "type" "payment"."transactions_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment"."transactions"`);
    await queryRunner.query(`DROP TYPE "payment"."transactions_type_enum"`);
  }
}
