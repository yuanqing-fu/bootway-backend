module.exports = ({ db, userRouter, bcrypt, jwt, validator, config }) => {
  userRouter.post('/login', async (ctx) => {
    const email = ctx.request.body.email
    const password = ctx.request.body.password

    if (!email || !validator.isEmail(email) || !password) {
      ctx.response.status = 400
      return ctx.body = { type: 'error', message: 'email and password fields are essential for authentication.' }
    }

    let results = await db('users').where('email', email)

    let dbError = false //todo 数据库错误处理

    if (dbError) {
      ctx.response.status = 500
      return ctx.body = { type: 'error', message: 'database error' }
    }

    // 没找到用户
    if (results.length === 0) {
      ctx.response.status = 403
      ctx.response.message = 'user not found'
      return ctx.body = { type: 'error', message: 'user not found' }

    }

    const user = results[0]

    const match = await bcrypt.compare(password, user.password)

    if (match) {
      ctx.response.message = 'User logged in.'
      await db('users')
        .where({ id: user.id })
        .update({ last_login_at: new Date() })
      return ctx.body = {
        type: 'success',
        user: { id: user.id, email: user.email, name: user.name },
        token: jwt.sign({ id: user.id, email: user.email, name: user.name }, config.jwtToken, { expiresIn: '7d' })
      }
    } else {
      ctx.response.status = 500
      ctx.response.message = 'Password is incorrect.'
      return ctx.body = { type: 'error', message: 'Password is incorrect.' }
    }
  })

  userRouter.post('/register', async (ctx) => {
    const name = ctx.request.body.name
    const email = ctx.request.body.email
    const password = ctx.request.body.password

    if (!name || !email || !validator.isEmail(email) || !password) {
      ctx.response.status = 400
      return ctx.body = { type: 'error', message: 'name, email and password fields are essential.' }
    }

    let results = await db('users').where('email', email)

    let dbError = false //todo 数据库错误处理

    if (dbError) {
      ctx.response.status = 500
      return ctx.body = { type: 'error', message: 'database error' }
    }

    // 找到相同账号，不能注册
    if (results.length !== 0) {
      ctx.response.status = 403
      ctx.response.message = 'user already registered'
      return ctx.body = { type: 'error', message: 'user already registered' }
    }

    const user = {
      name: name,
      email: email,
      created_at: new Date(),
      last_login_at: new Date()
    }

    user.password = await bcrypt.hash(password, 10)

    // 将新用户加入数据库，返回用户 ID
    let registerResults = await db('users').insert(user)

    if (registerResults && registerResults.length === 1) {
      ctx.response.message = 'User registered.'
      return ctx.body = {
        type: 'success',
        user: { id: registerResults[0], email: user.email, name: user.name },
        token: jwt.sign({ id: registerResults[0], email: user.email, name: user.name }, config.jwtToken, { expiresIn: '7d' })
      }
    } else {
      ctx.response.status = 500
      ctx.response.message = 'Register failed.'
      return ctx.body = { type: 'error', message: 'Register failed.' }
    }
  })

  userRouter.get('/me', async (ctx) => {
    const token = ctx.request.headers['x-access-token']
    if (!token) {
      ctx.response.status = 400
      ctx.response.message = 'x-access-token header not found.'
      return ctx.body = { type: 'error', message: 'x-access-token header not found.' }
    }

    let result = ''

    try {
      result = await jwt.verify(token, config.jwtToken)
    } catch (e) {
      ctx.response.status = 403
      return ctx.body = { type: 'error', message: 'Provided token is invalid.' }
    }

    if (result && result.email) {
      return ctx.body = {
        type: 'success',
        message: 'Provided token is valid.',
        result
      }
    } else {
      // 错误处理 if (error) return ctx.response.status(403).json({ type: 'error', message: 'Provided token is invalid.', error })
    }

  })

  return userRouter
}
