import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFinanceSchema1718262701466 implements MigrationInterface {
  name = 'AddFinanceSchema1718262701466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS finance`);
    await queryRunner.query(
      `CREATE TYPE "finance"."transactions_type_enum" AS ENUM('top_up', 'rental_payment', 'refund', 'penalty')`,
    );
    await queryRunner.query(
      `CREATE TABLE "finance"."transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "description" text, "type" "finance"."transactions_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "rental_id" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e9acc6efa76de013e8c1553ed2" ON "finance"."transactions" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f2690b1d2c14e7f559c979e0b" ON "finance"."transactions" ("rental_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."transactions" ADD CONSTRAINT "FK_1f2690b1d2c14e7f559c979e0b1" FOREIGN KEY ("rental_id") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "finance"."transactions" DROP CONSTRAINT "FK_1f2690b1d2c14e7f559c979e0b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`,
    );
    await queryRunner.query(
      `DROP INDEX "finance"."IDX_1f2690b1d2c14e7f559c979e0b"`,
    );
    await queryRunner.query(
      `DROP INDEX "finance"."IDX_e9acc6efa76de013e8c1553ed2"`,
    );
    await queryRunner.query(`DROP TABLE "finance"."transactions"`);
    await queryRunner.query(`DROP TYPE "finance"."transactions_type_enum"`);
    await queryRunner.query(`DROP SCHEMA finance`);
  }
}
