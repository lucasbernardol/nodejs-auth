import process from 'node:process';

import { app } from './app.js';

const _PORT = Number(process.env.PORT) || 3333;

export async function bootstrap() {
  app.listen(_PORT, () => console.log(`\nPORT: ${_PORT}`));
}
