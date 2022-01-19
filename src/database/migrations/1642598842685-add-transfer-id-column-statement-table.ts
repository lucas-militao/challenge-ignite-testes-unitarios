import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class addTransferIdColumnStatementTable1642598842685 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn("statements", new TableColumn({
        name: "transfer_id",
        type: "uuid",
        isNullable: true
      }));

      await queryRunner.createForeignKey("statements", new TableForeignKey({
        name: "FKStatementTransfer",
        columnNames: ["transfer_id"],
        referencedTableName: "transfers",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn("statements", "transfer_id");
    }

}
