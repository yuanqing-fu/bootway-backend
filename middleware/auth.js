const jwt = require('jsonwebtoken')

module.exports = function (ctx, config) {
  const token = ctx.request.headers['x-access-token']
  if (!token) {
    ctx.response.status = 400
    ctx.body = { type: 'error', message: 'Please login' }
  } else {
    let result = ''

    try {
      result = jwt.verify(token, config.jwtToken)
    } catch (e) {
      ctx.response.status = 403
      ctx.body = { type: 'error', message: 'Token is invalid.' }
    }

    if (result && result.email) {
      ctx.body = {
        type: 'success',
        message: 'Token is valid.',
        result
      }
    } else {
      // 错误处理 if (error) return ctx.response.status(403).json({ type: 'error', message: 'Provided token is invalid.', error })
    }
  }

  return ctx
}
