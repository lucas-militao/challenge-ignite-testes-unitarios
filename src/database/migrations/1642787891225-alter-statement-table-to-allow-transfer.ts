import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class alterStatementTableToAllowTransfer1642787891225 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn("statements", "type");

      await queryRunner.addColumns("statements", [
        new TableColumn({
          name: "type",
          type: 'enum',
          enum: ['deposit', 'withdraw', 'transfer']
        }),
        new TableColumn({
          name: "receiver_id",
          type: "uuid",
          isNullable: true,
        })
      ]);

      await queryRunner.createForeignKey("statements", new TableForeignKey({
        columnNames: ["receiver_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumns("statements", ["type", "receiver_id"]);
    }

}
