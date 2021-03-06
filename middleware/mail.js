module.exports = {
  async sendMail (to, subject, html) {
    const config = require('../config/config')
    const nodemailer = require('nodemailer')

    let transporter = nodemailer.createTransport(config.smtpEmail)

    let mailOptions = {
      from: 'Bootway <fuyuanqing@bootway.com>',
      to: to,
      subject: subject,
      html: html
    }

    let result = 'failed'
    try {
      result = await transporter.sendMail(mailOptions)
      console.log('sending email ok ')
    } catch (e) {
      console.log('sending email error ', e)
      result = 'failed'
    }

    return result
  },
  async sendEmailVerificationForNewUser (to, clientMainURL, token) {
    return await this.sendMail(to, '您好，请确认您的邮箱账号', `<div><b>请点击以下链接激活账号（链接有效时间为24小时）</b><div/>
<a target="_blank" href="${clientMainURL}/email-verification/${token}">${clientMainURL}/email-verification/${token}</a>`)
  },
  async sendResetPasswordEmail (to, clientMainURL, token) {
    return await this.sendMail(to, '您好，请重置密码', `<div><b>请点击以下链接重置密码（链接有效时间为20分钟）</b><div/>
<a target="_blank" href="${clientMainURL}/password/${token}">${clientMainURL}/password/${token}</a>`)
  }
}
