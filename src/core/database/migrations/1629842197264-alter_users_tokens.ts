import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterUsersTokens1629842197264 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'resetPasswordToken',
        type: 'varchar',
        isNullable: true,
        default: null,
      })
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'resetPasswordExpires',
        type: 'timestamp',
        isNullable: true,
        default: null,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'resetPasswordToken');

    await queryRunner.dropColumn('users', 'resetPasswordExpires');
  }
}
