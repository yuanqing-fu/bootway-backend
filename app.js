const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");

const app = new Koa();
const router = new Router();

app.use(logger());

router.get("/", (ctx, next) => {
  ctx.body = "Hello World1!";
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit("error", err, ctx);
  }
});

const server = app.listen(3003);
module.exports = server;
