import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserAvatar1758091299396 implements MigrationInterface {
  name = 'UpdateUserAvatar1758091299396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."user_avatar" DROP CONSTRAINT "FK_90a1254abd9cce470f8cbea3b18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_avatar" ALTER COLUMN "url" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_avatar" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_avatar" ADD CONSTRAINT "FK_90a1254abd9cce470f8cbea3b18" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."user_avatar" DROP CONSTRAINT "FK_90a1254abd9cce470f8cbea3b18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_avatar" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_avatar" ALTER COLUMN "url" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_avatar" ADD CONSTRAINT "FK_90a1254abd9cce470f8cbea3b18" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
