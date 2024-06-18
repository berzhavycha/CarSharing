import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesInRentalSchema1718264065853
  implements MigrationInterface
{
  name = 'AddIndexesInRentalSchema1718264065853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_998e7e79ec945284ec8194d9a3" ON "rental"."cars" ("model") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ffa158ee4fe74dbf3e92ca697a" ON "rental"."original_cars" ("model") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b13ac8580bd6a011f47a476fba" ON "rental"."rentals" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_243d136cb7fd3e65b4630fe6bf" ON "rental"."rentals" ("car_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_348cdfbafe36388e2dba8f1b83" ON "rental"."rentals" ("original_car_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "rental"."IDX_348cdfbafe36388e2dba8f1b83"`,
    );
    await queryRunner.query(
      `DROP INDEX "rental"."IDX_243d136cb7fd3e65b4630fe6bf"`,
    );
    await queryRunner.query(
      `DROP INDEX "rental"."IDX_b13ac8580bd6a011f47a476fba"`,
    );
    await queryRunner.query(
      `DROP INDEX "rental"."IDX_ffa158ee4fe74dbf3e92ca697a"`,
    );
    await queryRunner.query(
      `DROP INDEX "rental"."IDX_998e7e79ec945284ec8194d9a3"`,
    );
  }
}
