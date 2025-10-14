import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCarOutbox1759750709792 implements MigrationInterface {
  name = 'AddCarOutbox1759750709792';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "car"."car_outbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topic" text NOT NULL, "event_type" text NOT NULL, "payload" jsonb NOT NULL, "key" character varying, "headers" jsonb NOT NULL DEFAULT '{}'::jsonb, "status" character varying NOT NULL DEFAULT 'PENDING', "attempts" integer NOT NULL DEFAULT '0', "send_after" TIMESTAMP WITH TIME ZONE, "last_error" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sent_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_34b8f7cfe1c39e9b15b18065a38" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "car"."car_outbox"`);
  }
}
