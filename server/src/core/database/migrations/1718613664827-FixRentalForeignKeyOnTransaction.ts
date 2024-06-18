import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRentalForeignKeyOnTransaction1718613664827
  implements MigrationInterface
{
  name = 'FixRentalForeignKeyOnTransaction1718613664827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "finance"."transactions" DROP CONSTRAINT "FK_1f2690b1d2c14e7f559c979e0b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."transactions" ADD CONSTRAINT "FK_1f2690b1d2c14e7f559c979e0b1" FOREIGN KEY ("rental_id") REFERENCES "rental"."rentals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "finance"."transactions" DROP CONSTRAINT "FK_1f2690b1d2c14e7f559c979e0b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "finance"."transactions" ADD CONSTRAINT "FK_1f2690b1d2c14e7f559c979e0b1" FOREIGN KEY ("rental_id") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
