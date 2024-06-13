import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSaltColumnsForHashes1718270912424
  implements MigrationInterface
{
  name = 'AddSaltColumnsForHashes1718270912424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD "password_salt" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD "refresh_token_salt" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP COLUMN "refresh_token_salt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP COLUMN "password_salt"`,
    );
  }
}
