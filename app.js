const Koa = require('koa')
const cors = require('koa2-cors')
const Router = require('koa-router')
const logger = require('koa-logger')

const bodyParser = require('koa-bodyparser');
const validator = require('validator')

const auth = require('./middleware/auth');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const auth = require('./services/auth/auth')
const config = require('./config/config')

const moment = require('moment')

const app = new Koa()

app.use(bodyParser());

require('dotenv').config()

//CORS
// process.env.DB_CROS_ORIGIN_2
app.use(
  cors({
      origin: function (ctx) {

        const requestOrigin = (ctx.protocol + '://').concat(ctx.get('Origin').replace('http://', '').replace('https://', ''))

        const whiteList = [(ctx.protocol + '://').concat(process.env.DB_CROS_ORIGIN_1), (ctx.protocol + '://').concat(process.env.DB_CROS_ORIGIN_2)] //可跨域白名单

        if (whiteList.includes(requestOrigin)) {
          return requestOrigin
        }
        return false
      }
    }
  ))
// app.use(cors({origin:"http://bootway.com:3000"}))

// log all events to the terminal
app.use(logger())

const db = require('knex')({
  client: 'mysql2',
  connection: config.connection
})

const userRouter = new Router({
  prefix: '/auth'
})

app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

//authentication
// app.use('./services/auth/auth', auth({ db, userRouter, bcrybt, jwt, jwtToken: config}))
require('./services/auth/auth')({ db, userRouter, bcrypt, jwt, validator, config})



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

