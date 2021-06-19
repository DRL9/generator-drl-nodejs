module.exports = {
    filesToCopy: [
        '_.eslintignore',
        '_.eslintrc',
        '_.gitignore',
        '_jsconfig.json',
        '_.prettierrc',
        '_jest.config.js',
        'main.js',
        'test',
    ],
    mainJs: {
        Koa: 'main.koa.js',
    },
    extraFilesToCopy: {
        Koa: ['src/logger.js', 'src/router.js'],
    },
    filesToRender: ['_package.json', '_readme.md'],
};
