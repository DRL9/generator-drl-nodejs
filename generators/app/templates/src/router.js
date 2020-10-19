const Router = require('@koa/router');
<% if (includeGraphql) {%>
const gqlMiddlewave = require('./graphql');
<%}%>


const rootRouter = new Router();

const testRouter = new Router({});

testRouter.get('/hello', (ctx) => {
    ctx.body = 'hello';
});
rootRouter.use(testRouter.routes());
<% if (includeGraphql) {%>
rootRouter.post(gqlMiddlewave.path, gqlMiddlewave);
<%}%>


module.exports = rootRouter;
