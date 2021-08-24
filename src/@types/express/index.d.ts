declare namespace Express {
  export interface Request {
    user: {
      /**
       * - ID, unique identifier `user`.
       */
      id: string;
      decoded: any;
    };
  }
}
