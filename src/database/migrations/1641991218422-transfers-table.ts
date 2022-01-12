import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class transfersTable1641991218422 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: 'transfers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'statement_id',
            type: 'uuid',
          },
          {
            name: 'sender_id',
            type: 'uuid',
          },
          {
            name: 'receiver_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          }
        ],
        foreignKeys: [
          {
            name: 'transfer_sender',
            columnNames: ['sender_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
          {
            name: 'transfer_receiver',
            columnNames: ['receiver_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
          {
            name: 'transfer_statement',
            columnNames: ['statement_id'],
            referencedTableName: 'statements',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
        ]
      }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('transfers');
    }

}
