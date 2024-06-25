import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocalFileToCarsEntities1719314362070 implements MigrationInterface {
    name = 'AddLocalFileToCarsEntities1719314362070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."users" DROP CONSTRAINT "FK_3e1f52ec904aed992472f2be147"`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" RENAME COLUMN "image_url" TO "picture_id"`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" RENAME COLUMN "image_url" TO "picture_id"`);
        await queryRunner.query(`ALTER TABLE "auth"."users" DROP CONSTRAINT "UQ_3e1f52ec904aed992472f2be147"`);
        await queryRunner.query(`ALTER TABLE "auth"."users" DROP COLUMN "avatarId"`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" DROP COLUMN "picture_id"`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" ADD "picture_id" uuid`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" ADD CONSTRAINT "UQ_f5374100b01b8225843551a5528" UNIQUE ("picture_id")`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" DROP COLUMN "picture_id"`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" ADD "picture_id" uuid`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" ADD CONSTRAINT "UQ_7cd8acb4e36c6536cfd8be9f8c7" UNIQUE ("picture_id")`);
        await queryRunner.query(`ALTER TABLE "auth"."users" DROP COLUMN "avatar_id"`);
        await queryRunner.query(`ALTER TABLE "auth"."users" ADD "avatar_id" uuid`);
        await queryRunner.query(`ALTER TABLE "auth"."users" ADD CONSTRAINT "UQ_c3401836efedec3bec459c8f818" UNIQUE ("avatar_id")`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" ADD CONSTRAINT "FK_f5374100b01b8225843551a5528" FOREIGN KEY ("picture_id") REFERENCES "local_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" ADD CONSTRAINT "FK_7cd8acb4e36c6536cfd8be9f8c7" FOREIGN KEY ("picture_id") REFERENCES "local_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth"."users" ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "local_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" DROP CONSTRAINT "FK_7cd8acb4e36c6536cfd8be9f8c7"`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" DROP CONSTRAINT "FK_f5374100b01b8225843551a5528"`);
        await queryRunner.query(`ALTER TABLE "auth"."users" DROP CONSTRAINT "UQ_c3401836efedec3bec459c8f818"`);
        await queryRunner.query(`ALTER TABLE "auth"."users" DROP COLUMN "avatar_id"`);
        await queryRunner.query(`ALTER TABLE "auth"."users" ADD "avatar_id" character varying`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" DROP CONSTRAINT "UQ_7cd8acb4e36c6536cfd8be9f8c7"`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" DROP COLUMN "picture_id"`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" ADD "picture_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" DROP CONSTRAINT "UQ_f5374100b01b8225843551a5528"`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" DROP COLUMN "picture_id"`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" ADD "picture_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "auth"."users" ADD "avatarId" uuid`);
        await queryRunner.query(`ALTER TABLE "auth"."users" ADD CONSTRAINT "UQ_3e1f52ec904aed992472f2be147" UNIQUE ("avatarId")`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" RENAME COLUMN "picture_id" TO "image_url"`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" RENAME COLUMN "picture_id" TO "image_url"`);
        await queryRunner.query(`ALTER TABLE "auth"."users" ADD CONSTRAINT "FK_3e1f52ec904aed992472f2be147" FOREIGN KEY ("avatarId") REFERENCES "local_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
