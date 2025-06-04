import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransactionTable1749026577021 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "transactions",
                columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "description", type: "varchar" },
                { name: "date", type: "varchar" },
                { name: "value", type: "decimal" },
                { name: "type", type: "varchar" }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("transactions");
    }

}
