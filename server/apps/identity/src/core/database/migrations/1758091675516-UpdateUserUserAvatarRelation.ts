import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserUserAvatarRelation1758091675516
  implements MigrationInterface
{
  name = 'UpdateUserUserAvatarRelation1758091675516';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP CONSTRAINT "REL_c3401836efedec3bec459c8f81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP COLUMN "avatar_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_avatar" DROP CONSTRAINT "FK_90a1254abd9cce470f8cbea3b18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_avatar" ADD CONSTRAINT "UQ_90a1254abd9cce470f8cbea3b18" UNIQUE ("user_id")`,
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
      `ALTER TABLE "auth"."user_avatar" DROP CONSTRAINT "UQ_90a1254abd9cce470f8cbea3b18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_avatar" ADD CONSTRAINT "FK_90a1254abd9cce470f8cbea3b18" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "auth"."users" ADD "avatar_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD CONSTRAINT "REL_c3401836efedec3bec459c8f81" UNIQUE ("avatar_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "auth"."user_avatar"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }
}
