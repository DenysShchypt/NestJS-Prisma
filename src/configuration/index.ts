export default () => ({
  secret: process.env.JWT_SECRET,
  expireJwt: process.env.JWT_EXPIRE,
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI,
});
