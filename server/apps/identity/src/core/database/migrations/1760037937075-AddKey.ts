import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKey1760037937075 implements MigrationInterface {
  name = 'AddKey1760037937075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."user_outbox" ADD "partition_key" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_outbox" ALTER COLUMN "headers" SET DEFAULT '{}'::jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."user_outbox" ALTER COLUMN "headers" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_outbox" DROP COLUMN "partition_key"`,
    );
  }
}
