import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterRenameTokenColumns1629919709896
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'users',
      'resetPasswordToken',
      'reset_token'
    );

    await queryRunner.renameColumn(
      'users',
      'resetPasswordExpires',
      'reset_token_expires'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'users',
      'reset_token',
      'resetPasswordToken'
    );

    await queryRunner.renameColumn(
      'users',
      'reset_token_expires',
      'resetPasswordExpires'
    );
  }
}
