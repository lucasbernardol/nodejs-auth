export default {
  secret: process.env.TOKEN_SECRET,
  expiresIn: 1 * 24 * 60 * 60, // 1 day (seconds)
};
