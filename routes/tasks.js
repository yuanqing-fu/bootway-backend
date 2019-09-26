module.exports = (router,knex ) => {
    router.get("/", async (ctx, next) => {
        let result = await knex.column('type').select().from('task');
        ctx.body = result[0].type;
    });

    router.get("/task", async (ctx, next) => {
        //todo 用户id是放在参数还是header里
        //get task list
        ctx.body = "{type:123}";
    });

    router.post("/task", async (ctx, next) => {
        //create a task
    });

    router.del("/task", async (ctx, next) => {
        //create a task
    });
};
