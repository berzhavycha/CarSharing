import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPartitionKeyColumn1760008077730 implements MigrationInterface {
  name = 'AddPartitionKeyColumn1760008077730';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car"."car_outbox" ALTER COLUMN "headers" SET DEFAULT '{}'::jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car"."car_outbox" ALTER COLUMN "headers" SET DEFAULT '{}'`,
    );
  }
}
