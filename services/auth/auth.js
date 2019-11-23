module.exports = ({ db, userRouter, bcrypt, jwt, validator, Mail, config }) => {
// errorCode: 0 未注册
// errorCode: 1 注册未验证邮箱
  userRouter.post('/login', async (ctx) => {
    const email = ctx.request.body.email
    const password = ctx.request.body.password

    if (!email || !validator.isEmail(email) || !password) {
      ctx.response.status = 400
      return ctx.body = { type: 'error', message: 'email and password fields are essential for authentication.' }
    }

    let results = await db('users').where({
      'email': email
    })

    let dbError = false //todo 数据库错误处理

    if (dbError) {
      ctx.response.status = 500
      return ctx.body = { type: 'error', message: 'database error' }
    }

    // 没找到用户
    if (results.length === 0) {
      ctx.response.status = 200
      ctx.response.message = 'user not found'
      return ctx.body = { errorCode: 0, type: 'error', message: 'user not found' }
    } else if (results[0].verified === 0) {
      ctx.response.status = 200
      ctx.response.message = 'user not verified'
      return ctx.body = { errorCode: 1, type: 'error', message: 'user not verified' }
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

  userRouter.post('/email-verification', async (ctx) => {
    // 验证用户点击的链接里的token是否正确
    const token = ctx.request.body.token
    if (!token) {
      ctx.response.status = 400
      ctx.response.message = 'Provided token is invalid.'
      return ctx.body = { type: 'error', message: 'Provided token is invalid.' }
    }

    let result = ''

    try {
      result = await jwt.verify(token, config.jwtTokenForEmailVerification)

      // 验证成功直接让用户登录 并且在数据库里更改user的 verified:1
      const dbResult = await db('users')
        .where({ id: result.id, verified: 0 })
        .update({ verified: 1 })

      ctx.response.message = 'Email verified.'
      return ctx.body = {
        type: 'success',
        user: { id: result.id, email: result.email, name: result.name },
        token: jwt.sign({
          id: result.id,
          email: result.email,
          name: result.name
        }, config.jwtToken, { expiresIn: '7d' })
      }
    } catch (e) {
      ctx.response.status = 403
      return ctx.body = { type: 'error', message: 'Provided token is invalid.' }
    }

  })

  userRouter.post('/register', async (ctx) => {
    const clientMainURL = ctx.request.header.origin
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
      if (results[0].verified === 0) {
        ctx.response.status = 200
        ctx.response.message = 'user not verified'
        return ctx.body = { errorCode: 1, type: 'error', message: 'user not verified' }
      } else {
        ctx.response.status = 403
        ctx.response.message = 'user already registered'
        return ctx.body = { type: 'error', message: 'user already registered' }
      }
    }

    // 允许注册
    const user = {
      name: name,
      email: email,
      created_at: new Date(),
      last_login_at: new Date()
    }

    // 加密密码
    user.password = await bcrypt.hash(password, 10)

    // 将新用户加入数据库，返回用户 ID
    let registerResults = await db('users').insert(user)

    if (registerResults && registerResults.length === 1) {
      // 注册成功，此处需要发送注册成功激活邮件
      const token = jwt.sign({
        id: registerResults[0],
        email: user.email,
        name: user.name
      }, config.jwtTokenForEmailVerification, { expiresIn: '1d' })

      // 发送邮件
      let emailSendingResult = await Mail.sendEmailVerificationForNewUser('kofbossyagami@163.com', clientMainURL, token)

      if (emailSendingResult !== 'failed') {
        ctx.response.status = 200
        ctx.response.message = 'Email sent.'
        return ctx.body = { type: 'success', message: 'Email sent.' }
      } else {
        ctx.response.status = 500
        ctx.response.message = 'Email sent failed.'
        return ctx.body = { type: 'error', message: 'Email sent failed.' }
      }
    } else {
      ctx.response.status = 500
      ctx.response.message = 'Register failed.'
      return ctx.body = { type: 'error', message: 'Register failed.' }
    }
  })

  userRouter.post('/authenticate', async (ctx) => {
    const token = ctx.request.headers['x-access-token']
    if (!token) {
      ctx.response.status = 400
      ctx.response.message = 'x-access-token header not found.'
      return ctx.body = { type: 'error', message: 'x-access-token header not found.' }
    }

    let result = ''

    try {
      result = await jwt.verify(token, config.jwtToken)

      if (result && result.email) {
        return ctx.body = {
          type: 'success',
          message: 'Provided token is valid.',
          result
        }
      }
    } catch (e) {
      ctx.response.status = 403
      return ctx.body = { type: 'error', message: 'Provided token is invalid.' }
    }

  })

  return userRouter
}
