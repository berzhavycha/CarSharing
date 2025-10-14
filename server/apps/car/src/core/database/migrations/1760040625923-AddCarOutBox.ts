import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCarOutBox1760040625923 implements MigrationInterface {
  name = 'AddCarOutBox1760040625923';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car"."car_outbox" ADD "partition_key" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "car"."car_outbox" ADD "ordering_key" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "car"."car_outbox" ALTER COLUMN "headers" SET DEFAULT '{}'::jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car"."car_outbox" ALTER COLUMN "headers" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "car"."car_outbox" DROP COLUMN "ordering_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car"."car_outbox" DROP COLUMN "partition_key"`,
    );
  }
}
