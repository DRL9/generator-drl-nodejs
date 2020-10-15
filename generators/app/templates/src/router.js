const Router = require('@koa/router');

const rootRouter = new Router();

const testRouter = new Router({});

testRouter.get('/hello', (ctx) => {
    ctx.body = 'hello';
});
rootRouter.use(testRouter.routes());

module.exports = rootRouter;
