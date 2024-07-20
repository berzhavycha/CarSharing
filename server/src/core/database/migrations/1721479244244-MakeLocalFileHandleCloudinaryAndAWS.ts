import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeLocalFileHandleCloudinaryAndAWS1721479244244
  implements MigrationInterface
{
  name = 'MakeLocalFileHandleCloudinaryAndAWS1721479244244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public_file" ADD "public_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "public_file" ALTER COLUMN "key" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public_file" ALTER COLUMN "key" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public_file" DROP COLUMN "public_id"`,
    );
  }
}
