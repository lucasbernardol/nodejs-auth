import { randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

export const randomBytesAsync = promisify(randomBytes);

export async function randomToken({ tokenLength } = { tokenLength: 32 }) {
  const bytesBuffer = await randomBytesAsync(tokenLength);

  const token = bytesBuffer.toString('hex');

  return {
    token,
  };
}
