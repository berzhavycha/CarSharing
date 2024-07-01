import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRelationBetweenUsersAndLocalFiles1719388778781
  implements MigrationInterface
{
  name = 'FixRelationBetweenUsersAndLocalFiles1719388778781';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"`,
    );
    await queryRunner.query(`ALTER TABLE "local_files" ADD "avatar_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "local_files" ADD CONSTRAINT "UQ_dec19b375e8bf78340d42fc0407" UNIQUE ("avatar_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "local_files" ADD CONSTRAINT "FK_dec19b375e8bf78340d42fc0407" FOREIGN KEY ("avatar_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "local_files"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."users" DROP CONSTRAINT "FK_c3401836efedec3bec459c8f818"`,
    );
    await queryRunner.query(
      `ALTER TABLE "local_files" DROP CONSTRAINT "FK_dec19b375e8bf78340d42fc0407"`,
    );
    await queryRunner.query(
      `ALTER TABLE "local_files" DROP CONSTRAINT "UQ_dec19b375e8bf78340d42fc0407"`,
    );
    await queryRunner.query(
      `ALTER TABLE "local_files" DROP COLUMN "avatar_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."users" ADD CONSTRAINT "FK_c3401836efedec3bec459c8f818" FOREIGN KEY ("avatar_id") REFERENCES "local_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
