import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class addresses1630960659087 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
          },

          {
            name: 'user_id',
            type: 'uuid',
          },

          {
            name: 'zipcode',
            type: 'varchar',
            isNullable: false,
          },

          {
            name: 'street',
            type: 'varchar',
            isNullable: false,
          },

          {
            name: 'city',
            type: 'varchar',
            isNullable: false,
          },

          {
            name: 'district',
            type: 'varchar',
            isNullable: false,
          },

          {
            name: 'uf',
            type: 'varchar',
            isNullable: true,
            default: null,
          },

          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
            default: null,
          },

          {
            name: 'number',
            type: 'integer',
            isNullable: true,
            default: null,
          },

          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },

          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'addresses_foreign_key',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onUpdate: 'SET NULL',
            onDelete: 'CASCADE',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses');
  }
}
