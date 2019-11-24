const DOTENV = require('dotenv').config()
console.log('DOTENV.parsed.CROS_ORIGIN_1=', DOTENV.parsed.CROS_ORIGIN_1)
module.exports = {
  CROS_ORIGIN_1: DOTENV.parsed.CROS_ORIGIN_1,
  CROS_ORIGIN_2: DOTENV.parsed.CROS_ORIGIN_2,
  jwtToken: DOTENV.parsed.jwtToken,
  jwtTokenForEmailVerification: DOTENV.parsed.jwtTokenForEmailVerification,
  jwtTokenForPasswordReset: DOTENV.parsed.jwtTokenForPasswordReset,
  dbConnection: {
    host: DOTENV.parsed.DB_HOST,
    user: DOTENV.parsed.DB_USER,
    password: DOTENV.parsed.DB_PASS,
    database: DOTENV.parsed.DB_NAME
  },
  smtpEmail: {
    host: DOTENV.parsed.SMTP_EMAIL_HOST,
    port: DOTENV.parsed.SMTP_EMAIL_PORT,
    secureConnection: true,
    auth: {
      user: DOTENV.parsed.SMTP_EMAIL_USER,
      pass: DOTENV.parsed.SMTP_EMAIL_PASS,
    }
  }
}
