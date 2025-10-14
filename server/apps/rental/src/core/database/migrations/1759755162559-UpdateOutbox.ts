import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOutbox1759755162559 implements MigrationInterface {
  name = 'UpdateOutbox1759755162559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rental"."rental_outbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topic" text NOT NULL, "event_type" text NOT NULL, "payload" jsonb NOT NULL, "key" character varying, "headers" jsonb NOT NULL DEFAULT '{}'::jsonb, "status" character varying NOT NULL DEFAULT 'PENDING', "attempts" integer NOT NULL DEFAULT '0', "send_after" TIMESTAMP WITH TIME ZONE, "last_error" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sent_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b24ca0a6ba287aebd95b5d592b0" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rental"."rental_outbox"`);
  }
}
