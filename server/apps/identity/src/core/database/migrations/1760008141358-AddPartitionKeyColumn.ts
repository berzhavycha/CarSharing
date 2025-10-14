import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPartitionKeyColumn1760008141358 implements MigrationInterface {
  name = 'AddPartitionKeyColumn1760008141358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."user_outbox" ALTER COLUMN "headers" SET DEFAULT '{}'::jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."user_outbox" ALTER COLUMN "headers" SET DEFAULT '{}'`,
    );
  }
}
