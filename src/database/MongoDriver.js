import process from 'node:process';
import mongoose from 'mongoose';

export class MongoDriver {
  /**
   *  Mongoose/MongoDB options.
   *
   * @type {import('mongoose').ConnectOptions}
   */
  #options = {
    autoIndex: true,
  };

  #events() {
    mongoose.connection.on('error', this.#error);
    mongoose.connection.on('open', this.#open);
  }

  async connect() {
    try {
      this.#events(); // Add events

      const options = this.#options;

      return await mongoose.connect(process.env.DATABASE_URI, options);
    } catch (error) {
      this.#error(error);
    }
  }

  #error(error) {
    console.error(error);

    process.exit(1);
  }

  #open() {
    console.log('DATABASE: OK');
  }
}

export default new MongoDriver();
