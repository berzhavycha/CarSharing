import { MigrationInterface, QueryRunner } from 'typeorm';

export class FileNullableColumns1757918392880 implements MigrationInterface {
  name = 'FileNullableColumns1757918392880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file"."file" ALTER COLUMN "filename" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "file"."file" ALTER COLUMN "path" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "file"."file" ALTER COLUMN "mimetype" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file"."file" ALTER COLUMN "mimetype" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "file"."file" ALTER COLUMN "path" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "file"."file" ALTER COLUMN "filename" SET NOT NULL`,
    );
  }
}
