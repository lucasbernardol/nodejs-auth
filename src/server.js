import process from 'node:process';

import MongoDriver from './database/MongoDriver.js';
import { app } from './app.js';

const _PORT = Number(process.env.PORT) || 3333;

export async function bootstrap() {
  await MongoDriver.connect();

  app.listen(_PORT, () => console.log(`\nPORT: ${_PORT}`));
}
