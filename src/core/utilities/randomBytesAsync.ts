import { randomBytes } from 'crypto';
import { promisify } from 'util';

/**
 * - randomBytes
 * - promisify
 */
async function randomBytesAsync(size: number = 22, en: BufferEncoding = 'hex') {
  const randomBytesAsyncFunction = promisify<number, Buffer>(randomBytes);

  const bytesInBufferObject = await randomBytesAsyncFunction(size);

  return bytesInBufferObject.toString(en);
}

export { randomBytesAsync };
