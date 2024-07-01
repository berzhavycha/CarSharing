import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameLocalFileTableToPlural1719341096908
  implements MigrationInterface
{
  name = 'RenameLocalFileTableToPlural1719341096908';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"`,
    );
    await queryRunner.query(
      `CREATE TABLE "local_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, "car_id" uuid, "original_car_id" uuid, CONSTRAINT "PK_c0799be7954074ff73c0eaf1922" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "local_files" (id, filename, path, mimetype, car_id, original_car_id) SELECT id, filename, path, mimetype, car_id, original_car_id FROM "local_file"`,
    );
    await queryRunner.query(`DROP TABLE "local_file"`);
    await queryRunner.query(
      `ALTER TABLE "local_files" ADD CONSTRAINT "FK_b6a36b343e6021e4075f9c39e35" FOREIGN KEY ("car_id") REFERENCES "rental"."cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "local_files" ADD CONSTRAINT "FK_78ef5b02b130ba7cfa6b7b9bac2" FOREIGN KEY ("original_car_id") REFERENCES "rental"."original_cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "local_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"`,
    );
    await queryRunner.query(
      `CREATE TABLE "local_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, "car_id" uuid, "original_car_id" uuid, CONSTRAINT "PK_c0799be7954074ff73c0eaf1922" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "local_file" (id, filename, path, mimetype, car_id, original_car_id) SELECT id, filename, path, mimetype, car_id, original_car_id FROM "local_files"`,
    );
    await queryRunner.query(`DROP TABLE "local_files"`);
    await queryRunner.query(
      `ALTER TABLE "local_file" ADD CONSTRAINT "FK_b6a36b343e6021e4075f9c39e35" FOREIGN KEY ("car_id") REFERENCES "rental"."cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "local_file" ADD CONSTRAINT "FK_78ef5b02b130ba7cfa6b7b9bac2" FOREIGN KEY ("original_car_id") REFERENCES "rental"."original_cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "local_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
