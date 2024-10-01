import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailConfirmation1727781831019 implements MigrationInterface {
  name = 'AddEmailConfirmation1727781831019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD "is_email_confirmed" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP COLUMN "is_email_confirmed"`,
    );
  }
}
