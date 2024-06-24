import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocalFileEntity1719238381952 implements MigrationInterface {
  name = 'AddLocalFileEntity1719238381952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "local_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, CONSTRAINT "PK_e391e00bc7475063fd45ee3f38d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP COLUMN "picture_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD "avatar_id" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "auth"."users" ADD "avatarId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD CONSTRAINT "UQ_3e1f52ec904aed992472f2be147" UNIQUE ("avatarId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD CONSTRAINT "FK_3e1f52ec904aed992472f2be147" FOREIGN KEY ("avatarId") REFERENCES "local_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP CONSTRAINT "FK_3e1f52ec904aed992472f2be147"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP CONSTRAINT "UQ_3e1f52ec904aed992472f2be147"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP COLUMN "avatarId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP COLUMN "avatar_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD "picture_url" character varying`,
    );
    await queryRunner.query(`DROP TABLE "local_file"`);
  }
}
