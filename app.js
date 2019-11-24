const Koa = require('koa')
const helmet = require('koa-helmet')
const cors = require('koa2-cors')
const Router = require('koa-router')
const logger = require('koa-logger')

const bodyParser = require('koa-bodyparser');
const validator = require('validator')

const auth = require('./middleware/auth');
const Mail = require('./middleware/mail');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const auth = require('./services/auth/auth')
const config = require('./config/config')

const moment = require('moment')

const app = new Koa()

// DOC: https://github.com/venables/koa-helmet
app.use(helmet())

// {
//   dnsPrefetchControl: true,
//     frameguard: true,
//   hidePoweredBy: true,
//   hsts: true,
//   ieNoOpen: true,
//   noSniff: true,
//   xssFilter: true
// }

app.use(bodyParser())

require('dotenv').config()

// 跨域处理 CORS
// app.use(
//   cors({
//       origin: function (ctx) {
//
//         const requestOrigin = (ctx.protocol + '://').concat(ctx.get('Origin').replace('http://', '').replace('https://', ''))
//
//         const whiteList = [(ctx.protocol + '://').concat(config.CROS_ORIGIN_1), (ctx.protocol + '://').concat(config.CROS_ORIGIN_2)] //可跨域白名单
//
//         if (whiteList.includes(requestOrigin)) {
//           return requestOrigin
//         }
//         return false
//       }
//     }
//   ))
app.use(cors({origin:"http://bootway.com"}))

// log all events to the terminal
app.use(logger())

const db = require('knex')({
  client: 'mysql2',
  connection: config.dbConnection
})

const userRouter = new Router({
  prefix: '/auth'
})

app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

//authentication
// app.use('./services/auth/auth', auth({ db, userRouter, bcrybt, jwt, jwtToken: config}))
require('./services/auth/auth')({ db, userRouter, bcrypt, jwt, validator, Mail, config})



// error handling
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})

const taskRouter = new Router({
  prefix: '/tasks'
})

require('./routes/tasks')(taskRouter, db, auth, moment, config)

app.use(taskRouter.routes())
app.use(taskRouter.allowedMethods())

const server = app.listen(3003)
module.exports = server

