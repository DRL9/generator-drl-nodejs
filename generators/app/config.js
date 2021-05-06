module.exports = {
    filesToCopy: [
        '_.eslintignore',
        '_.eslintrc',
        '_.gitignore',
        '_jsconfig.json',
        '_.prettierrc',
        '_jest.config.js',
        'main.js',
        '.husky',
        'test',
    ],
    mainJs: {
        Koa: 'main.koa.js',
    },
    extraFilesToCopy: {
        Koa: ['src/logger.js', 'src/router.js'],
    },
    filesToRender: ['_package.json', '_readme.md'],
    deps: {
        Koa: {
            dependencies: {
                '@koa/cors': '^3.1.0',
                '@koa/router': '^9.4.0',
                koa: '^2.13.0',
                'koa-bodyparser': '^4.3.0',
                winston: '^3.3.3',
                'winston-daily-rotate-file': '^4.5.0',
                chalk: '^4.1.0',
            },
            devDependencies: {
                nodemon: '^2.0.4',
            },
        },
    },
};
