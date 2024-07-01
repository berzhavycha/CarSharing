import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPictureColumnForUser1719056051331
  implements MigrationInterface
{
  name = 'AddPictureColumnForUser1719056051331';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD "picture_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP COLUMN "picture_url"`,
    );
  }
}
