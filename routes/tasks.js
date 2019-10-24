module.exports = (router, db, auth, config) => {

  //  获得当前用户任务列表
  router.get('/', async (ctx, next) => {
    ctx = auth(ctx, config)

    if (ctx.body.type !== 'error') {
      ctx.body = await db('task').where('user_id', ctx.body.result.id)
    }
  })

  // 创建任务
  router.post('/', async (ctx, next) => {
    ctx = auth(ctx, config)
    if (ctx.body.type !== 'error') {
      const name = ctx.request.body.name
      const important = ctx.request.body.important
      const urgent = ctx.request.body.urgent
      const start_date = ctx.request.body.start_date

      console.log(name,important,urgent,new Date(start_date))
      ctx.request.body.start_date = new Date(start_date)
      ctx.request.body.user_id = ctx.body.result.id
      ctx.request.body.done = false
      ctx.body = await db('task').insert(ctx.request.body)
    }
  })

  // 删除任务
  router.del('/:task_id', async (ctx, next) => {
    ctx = auth(ctx, config)
  })

  // router.get("/:id", auth, async (ctx, next) => {
  //
  // })

}
