import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOAuthTables1785587857086 implements MigrationInterface {

      public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "oauth_clients" (
        "id"                 uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "client_id"          character varying NOT NULL,
        "client_secret_hash" character varying NOT NULL,
        "name"               character varying NOT NULL,
        "redirect_uri"       character varying NOT NULL,
        "is_active"          boolean           NOT NULL DEFAULT true,
        "created_at"         TIMESTAMP         NOT NULL DEFAULT now(),
        "updated_at"         TIMESTAMP         NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_oauth_clients_client_id" UNIQUE ("client_id"),
        CONSTRAINT "PK_oauth_clients" PRIMARY KEY ("id")
      )
    `);
 
    await queryRunner.query(`
      CREATE TABLE "oauth_codes" (
        "id"                     uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "code_hash"              character varying NOT NULL,
        "redirect_uri"           character varying NOT NULL,
        "code_challenge"         character varying NOT NULL,
        "code_challenge_method"  character varying NOT NULL,
        "scopes"                 character varying NOT NULL,
        "expires_at"             TIMESTAMP         NOT NULL,
        "is_used"                boolean           NOT NULL DEFAULT false,
        "created_at"             TIMESTAMP         NOT NULL DEFAULT now(),
        "user_id"                uuid,
        "client_id"              uuid,
        CONSTRAINT "UQ_oauth_codes_code_hash" UNIQUE ("code_hash"),
        CONSTRAINT "PK_oauth_codes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_oauth_codes_user"
          FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_oauth_codes_client"
          FOREIGN KEY ("client_id") REFERENCES "oauth_clients"("id") ON DELETE CASCADE
      )
    `);
  }
 
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "oauth_codes"`);
    await queryRunner.query(`DROP TABLE "oauth_clients"`);
  }
}
