import 'dotenv/config';

import { Database } from './core/database/Database';

import { app } from './app';

/**
 * Database connection
 */
Database.connect();

app.listen(process.env.PORT || 3333, () => {
  console.log(`\nHOST: http://localhost:3333`);
});
