const Koa = require("koa")
const cors = require('@koa/cors')
const Router = require("koa-router")
const logger = require("koa-logger")

const app = new Koa()

require('dotenv').config()

//CORS
app.use(cors({origin:process.env.DB_CROS_ORIGIN_1}))
// app.use(cors({origin:"http://bootway.com:3000"}))

// log all events to the terminal
app.use(logger())

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
  }
});

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

require('./routes/tasks')(taskRouter,knex)

app.use(taskRouter.routes())
app.use(taskRouter.allowedMethods())


const server = app.listen(3003)
module.exports = server

