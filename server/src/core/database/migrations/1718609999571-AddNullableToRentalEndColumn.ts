import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNullableToRentalEndColumn1718609999571
  implements MigrationInterface
{
  name = 'AddNullableToRentalEndColumn1718609999571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" ALTER COLUMN "rental_end" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rental"."rentals" ALTER COLUMN "rental_end" SET NOT NULL`,
    );
  }
}
