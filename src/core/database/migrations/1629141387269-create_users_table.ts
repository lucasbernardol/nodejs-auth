import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUsersTable1629141387269 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
          },

          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },

          {
            name: 'username',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },

          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },

          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },

          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },

          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
