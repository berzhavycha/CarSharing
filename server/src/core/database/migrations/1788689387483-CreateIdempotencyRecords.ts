import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateIdempotencyRecords1788689387483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'idempotency_records',
        columns: [
          {
            name: 'key',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'payload_hash',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'",
            isNullable: false,
          },
          {
            name: 'result',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'expires_at',
            type: 'timestamptz',
            isNullable: false,
          },
        ],
      }),
    );
 
    await queryRunner.createIndex(
      'idempotency_records',
      new TableIndex({
        name: 'IDX_IDEMPOTENCY_RECORDS_EXPIRES_AT',
        columnNames: ['expires_at'],
      }),
    );
  }
 
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('idempotency_records');
  }
}