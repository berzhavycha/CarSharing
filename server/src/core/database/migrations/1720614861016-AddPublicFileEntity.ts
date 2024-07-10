import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublicFileEntity1720614861016 implements MigrationInterface {
    name = 'AddPublicFileEntity1720614861016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"`);
        await queryRunner.query(`CREATE TABLE "public_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "key" character varying NOT NULL, "car_id" uuid, "original_car_id" uuid, "avatar_id" uuid, CONSTRAINT "REL_d78f5b649b1e8c090e08fbf597" UNIQUE ("avatar_id"), CONSTRAINT "PK_bf2f5ba5aa6e3453b04cb4e4720" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public_file" ADD CONSTRAINT "FK_51276d2f5c1f0754463468814d3" FOREIGN KEY ("car_id") REFERENCES "rental"."cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public_file" ADD CONSTRAINT "FK_358ab9f3bd5605a89b3b9339c34" FOREIGN KEY ("original_car_id") REFERENCES "rental"."original_cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public_file" ADD CONSTRAINT "FK_d78f5b649b1e8c090e08fbf597a" FOREIGN KEY ("avatar_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`UPDATE "auth"."users" SET "avatar_id" = NULL WHERE "avatar_id" IS NOT NULL AND "avatar_id" NOT IN (SELECT "id" FROM "public_file")`);
        await queryRunner.query(`ALTER TABLE "auth"."users" ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "public_file"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"`);
        await queryRunner.query(`ALTER TABLE "public_file" DROP CONSTRAINT "FK_d78f5b649b1e8c090e08fbf597a"`);
        await queryRunner.query(`ALTER TABLE "public_file" DROP CONSTRAINT "FK_358ab9f3bd5605a89b3b9339c34"`);
        await queryRunner.query(`ALTER TABLE "public_file" DROP CONSTRAINT "FK_51276d2f5c1f0754463468814d3"`);
        await queryRunner.query(`DROP TABLE "public_file"`);
        await queryRunner.query(`ALTER TABLE "auth"."users" ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "local_files"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }
}
