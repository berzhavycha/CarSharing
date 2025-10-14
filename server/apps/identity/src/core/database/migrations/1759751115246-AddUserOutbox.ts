import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserOutbox1759751115246 implements MigrationInterface {
  name = 'AddUserOutbox1759751115246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth"."user_outbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topic" text NOT NULL, "event_type" text NOT NULL, "payload" jsonb NOT NULL, "key" character varying, "headers" jsonb NOT NULL DEFAULT '{}'::jsonb, "status" character varying NOT NULL DEFAULT 'PENDING', "attempts" integer NOT NULL DEFAULT '0', "send_after" TIMESTAMP WITH TIME ZONE, "last_error" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sent_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cb5562d4719d8d589f87a50aa04" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "auth"."user_outbox"`);
  }
}
