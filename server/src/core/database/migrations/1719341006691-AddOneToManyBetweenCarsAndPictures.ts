import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOneToManyBetweenCarsAndPictures1719341006691 implements MigrationInterface {
    name = 'AddOneToManyBetweenCarsAndPictures1719341006691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" DROP CONSTRAINT "FK_7cd8acb4e36c6536cfd8be9f8c7"`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" DROP CONSTRAINT "FK_f5374100b01b8225843551a5528"`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" DROP CONSTRAINT "UQ_7cd8acb4e36c6536cfd8be9f8c7"`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" DROP COLUMN "picture_id"`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" DROP CONSTRAINT "UQ_f5374100b01b8225843551a5528"`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" DROP COLUMN "picture_id"`);
        await queryRunner.query(`ALTER TABLE "local_file" ADD "car_id" uuid`);
        await queryRunner.query(`ALTER TABLE "local_file" ADD "original_car_id" uuid`);
        await queryRunner.query(`ALTER TABLE "local_file" ADD CONSTRAINT "FK_13496a279f1faa524c47e266e3a" FOREIGN KEY ("car_id") REFERENCES "rental"."cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "local_file" ADD CONSTRAINT "FK_6a5d1f704ace69f77a3a466087a" FOREIGN KEY ("original_car_id") REFERENCES "rental"."original_cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "local_file" DROP CONSTRAINT "FK_6a5d1f704ace69f77a3a466087a"`);
        await queryRunner.query(`ALTER TABLE "local_file" DROP CONSTRAINT "FK_13496a279f1faa524c47e266e3a"`);
        await queryRunner.query(`ALTER TABLE "local_file" DROP COLUMN "original_car_id"`);
        await queryRunner.query(`ALTER TABLE "local_file" DROP COLUMN "car_id"`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" ADD "picture_id" uuid`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" ADD CONSTRAINT "UQ_f5374100b01b8225843551a5528" UNIQUE ("picture_id")`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" ADD "picture_id" uuid`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" ADD CONSTRAINT "UQ_7cd8acb4e36c6536cfd8be9f8c7" UNIQUE ("picture_id")`);
        await queryRunner.query(`ALTER TABLE "rental"."cars" ADD CONSTRAINT "FK_f5374100b01b8225843551a5528" FOREIGN KEY ("picture_id") REFERENCES "local_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rental"."original_cars" ADD CONSTRAINT "FK_7cd8acb4e36c6536cfd8be9f8c7" FOREIGN KEY ("picture_id") REFERENCES "local_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
