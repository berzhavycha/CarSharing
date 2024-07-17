import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePublicFileEntity1721221357373 implements MigrationInterface {
    name = 'UpdatePublicFileEntity1721221357373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_file" RENAME COLUMN "key" TO "public_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_file" RENAME COLUMN "public_id" TO "key"`);
    }

}
