module.exports = (router, db, auth, config) => {

  //下面是todoist的restful API 例子
  // requests.get(
  //     "https://api.todoist.com/rest/v1/tasks",
  //     params={
  //         "project_id": 123
  //     },
  //     headers={
  //         "Authorization": "Bearer %s" % your_token
  //     }).json()

  router.get('/', async (ctx, next) => {
    //todo 用户id是放在参数还是header里
    //get task list
    ctx = auth(ctx, config)

    if (ctx.body.type !== 'error') {
      ctx.body = await db('task').where('user_id', ctx.body.result.id)
    }
  })

  // 创建任务
  router.post('/', async (ctx, next) => {

  })

  // 删除任务
  router.del('/:task_id', async (ctx, next) => {

  })

  // router.get("/:id", auth, async (ctx, next) => {
  //
  // })

}
