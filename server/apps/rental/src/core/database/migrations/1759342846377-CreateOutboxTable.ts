import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOutboxTable1759342846377 implements MigrationInterface {
  name = 'CreateOutboxTable1759342846377';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rental"."rentals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rental_start" TIMESTAMP NOT NULL DEFAULT now(), "rental_end" TIMESTAMP, "requested_hours" integer NOT NULL, "total_price" numeric(10,2) NOT NULL DEFAULT '0', "pick_up_location" character varying NOT NULL DEFAULT '', "drop_off_location" character varying NOT NULL DEFAULT '', "status" character varying(20) NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_251599d808d8f61a18ce8ff3bb" CHECK ("rental_start" < "rental_end"), CONSTRAINT "PK_2b10d04c95a8bfe85b506ba52ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rental"."outbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topic" text NOT NULL, "event_type" text NOT NULL, "payload" jsonb NOT NULL, "key" character varying, "headers" jsonb NOT NULL DEFAULT '{}'::jsonb, "status" character varying NOT NULL DEFAULT 'PENDING', "attempts" integer NOT NULL DEFAULT '0', "send_after" TIMESTAMP WITH TIME ZONE, "last_error" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sent_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rental"."outbox"`);
    await queryRunner.query(`DROP TABLE "rental"."rentals"`);
  }
}
