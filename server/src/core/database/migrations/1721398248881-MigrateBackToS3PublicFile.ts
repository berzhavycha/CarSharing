import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrateBackToS3PublicFile1721398248881 implements MigrationInterface {
    name = 'MigrateBackToS3PublicFile1721398248881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_file" RENAME COLUMN "public_id" TO "key"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_file" RENAME COLUMN "key" TO "public_id"`);
    }

}
