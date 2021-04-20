const Koa = require('koa');
const cors = require('@koa/cors');
const chalk = require('chalk');
const bodyParser = require('koa-bodyparser');
const logger = require('./src/logger');
const router = require('./src/router');

const app = new Koa();
app.proxy = true;
const STATUS_COLORS = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
};
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    let logLevel;
    if (ctx.status >= 500) {
        logLevel = 'error';
    } else if (ctx.status >= 400) {
        logLevel = 'warn';
    } else if (ctx.status >= 100) {
        logLevel = 'info';
    }
    const respBody = ctx.response.body;
    const outputBody = ctx.path.includes('/api');
    let msg =
        chalk.gray(`${ctx.method} ${ctx.originalUrl}`) +
        chalk[STATUS_COLORS[logLevel]](` ${ctx.status} `) +
        chalk.white(`${outputBody ? ctx.request.rawBody || '' : ''} `) +
        chalk.blue(`${outputBody ? (typeof respBody === 'string' ? respBody : JSON.stringify(respBody)) : ''} `) +
        chalk.gray(`${ms}ms`);

    logger.log(logLevel, msg);
});


app.use(cors());
app.use(bodyParser());
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        logger.error(err);
    }
});

app.use(router.routes());

if (require.main === module) {
    app.listen(4000, () => {
        console.log('server start at ', 4000);
    });
}
