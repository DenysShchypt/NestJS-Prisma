export default () => ({
  secret: process.env.JWT_SECRET,
  expireJwt: process.env.JWT_EXPIRE,
});
