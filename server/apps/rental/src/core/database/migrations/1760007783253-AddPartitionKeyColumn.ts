import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPartitionKeyColumn1760007783253 implements MigrationInterface {
  name = 'AddPartitionKeyColumn1760007783253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental"."rental_outbox" ADD "partition_key" text`,
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
      `ALTER TABLE "rental"."rental_outbox" DROP COLUMN "partition_key"`,
    );
  }
}
