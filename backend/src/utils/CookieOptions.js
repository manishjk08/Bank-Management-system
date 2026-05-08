export const refreshCookieOptions = {
  httpOnly: true,
  secure: false, //set true in production 
  sameSite: 'strict',
  maxAge: Number(process.env.REFRESH_TOKEN_EXPIRATION) * 1000
};