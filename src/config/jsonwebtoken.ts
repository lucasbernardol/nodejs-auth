export const jwtConfig = {
  secret: process.env.SECRET_KEY,

  /**
   * Token expires in seconds (s)
   */
  expires: 24 * 3600, // 24 hours
};
