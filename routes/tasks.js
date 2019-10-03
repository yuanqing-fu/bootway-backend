module.exports = (router,knex ) => {

    //下面是todoist的restful API 例子
    // requests.get(
    //     "https://api.todoist.com/rest/v1/tasks",
    //     params={
    //         "project_id": 123
    //     },
    //     headers={
    //         "Authorization": "Bearer %s" % your_token
    //     }).json()


    router.get("/", async (ctx, next) => {
      //todo 用户id是放在参数还是header里
      //get task list
      ctx.body = await knex.select().table('task');
    });

    router.get("/task", async (ctx, next) => {
        //todo 用户id是放在参数还是header里
        //get task list
      ctx.body = await knex.select().table('task');
      // ctx.body = result;
    });

    router.post("/task", async (ctx, next) => {
        //create a task
    });

    router.del("/task", async (ctx, next) => {
        //create a task
    });
};
