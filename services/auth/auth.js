module.exports = ({ db, userRouter, bcrypt, jwt, config }) => {
  userRouter.post('/login', async (ctx) => {
    const email = ctx.request.body.email
    const password = ctx.request.body.password

    // if (!email || !password) return ctx.response.status(400).json({
    //   type: 'error',
    //   message: 'email and password fields are essential for authentication.'
    // })

    let results = await db('users').where('email', email)

    let dbError = false //todo 数据库错误处理

    if (dbError) {
      ctx.response.status = 500
      ctx.body = { type: 'error', message: 'database error' }
      return
    }

    // 没找到用户
    if (results.length === 0) {
      ctx.response.status = 403
      ctx.response.message = 'user not found'
      ctx.body = { type: 'error', message: 'user not found' }
      return
    }

    const user = results[0]

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      ctx.response.message = 'User logged in.'
      return ctx.body = {
        type: 'success',
        user: { id: user.id, email: user.email },
        token: jwt.sign({ id: user.id, email: user.email }, config.jwtToken, { expiresIn: '7d' })
      }
    } else {
      ctx.response.status = 500
      ctx.response.message = 'Password is incorrect.'
      return ctx.body = { type: 'error', message: 'Password is incorrect.' }
    }
  })

  userRouter.get('/me', async (ctx) => {
    console.log('^^^^^^^^^^^^', ctx.request.header['x-access-token'])
    const token = ctx.request.headers['x-access-token']
    if (!token) {
      ctx.response.status = 400
      ctx.response.message = 'x-access-token header not found.'
      return ctx.body = { type: 'error', message: 'x-access-token header not found.' }
    }

    const decoded = await jwt.verify(token, config.jwtToken)
    console.log('**********', decoded)

    if(1===1){
      return ctx.body = {
        type: 'success',
        message: 'Provided token is valid.',
        decoded
      }
    }else {
      // 错误处理 if (error) return ctx.response.status(403).json({ type: 'error', message: 'Provided token is invalid.', error })
    }

  })

  return userRouter
}
