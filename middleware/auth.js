const jwt = require('jsonwebtoken')
// const config = require('/config/config')

module.exports = function (ctx) {
  const token = ctx.request.headers['x-access-token']
  if (!token) {
    ctx.response.status = 400
    ctx.response.message = 'x-access-token header not found.'
    ctx.body = { type: 'error', message: 'x-access-token header not found.' }
  } else {
    let result = ''

    try {
      // result = jwt.verify(token, config.jwtToken)
      result = jwt.verify(token, '********************')
      console.log('%%%%%%%%%%%%%%%%% jwt result... ', result)
    } catch (e) {
      console.log('%%%%%%%%%%%%%%%%% e... ', e)
      ctx.response.status = 403
      ctx.body = { type: 'error', message: 'Provided token is invalid.' }
    }

    if (result && result.email) {
      ctx.body = {
        type: 'success',
        message: 'Provided token is valid.',
        result
      }
    } else {
      // 错误处理 if (error) return ctx.response.status(403).json({ type: 'error', message: 'Provided token is invalid.', error })
    }
  }

  return ctx
}
