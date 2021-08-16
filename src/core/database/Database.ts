import 'reflect-metadata';

import { createConnection } from 'typeorm';

class Database {
  /**
   * Database connection.
   * @static
   */
  static async connect() {
    try {
      await createConnection();
    } catch (error) {
      console.error(error);
    }
  }
}

export { Database };
