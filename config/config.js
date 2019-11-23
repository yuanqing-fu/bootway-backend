require('dotenv').config()

module.exports = {
  CROS_ORIGIN_1: process.env.CROS_ORIGIN_1,
  CROS_ORIGIN_2: process.env.CROS_ORIGIN_2,
  jwtToken: process.env.jwtToken,
  jwtTokenForEmailVerification: process.env.jwtTokenForEmailVerification,
  jwtTokenForPasswordReset: process.env.jwtTokenForPasswordReset,
  dbConnection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  },
  smtpEmail: {
    host: process.env.SMTP_EMAIL_HOST,
    port: process.env.SMTP_EMAIL_PORT,
    secureConnection: true,
    auth: {
      user: process.env.SMTP_EMAIL_USER,
      pass: process.env.SMTP_EMAIL_PASS,
    }
  }
}
