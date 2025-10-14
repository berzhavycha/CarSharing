import { MigrationInterface, QueryRunner } from 'typeorm';

export class FileSchema1757918066051 implements MigrationInterface {
  name = 'FileSchema1757918066051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file"."file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, "url" character varying NOT NULL, "key" character varying, "public_id" character varying, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "file"."file"`);
  }
}
