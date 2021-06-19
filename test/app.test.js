const path = require('path');
const helpers = require('yeoman-test');
const fs = require('fs');
const assert = require('yeoman-assert');

const generatorPath = path.join(__dirname, '../generators/app');

function readPkgJsonContent() {
    return fs.promises.readFile('package.json', 'utf-8').then(JSON.parse);
}

describe('base', () => {
    beforeAll((done) => {
        helpers
            .run(generatorPath)
            .withPrompts({
                projectName: 'myProjectName',
                initGit: false,
            })
            .on('end', done);
    });
    test('creates expected files', () => {
        assert.file([
            '.eslintignore',
            '.eslintrc',
            '.gitignore',
            'jsconfig.json',
            '.prettierrc',
            'main.js',
            'jest.config.js',
            'test',
        ]);
    });
    test('projectName is rendered', () => {
        assert.fileContent('readme.md', '# myProjectName');
        assert.jsonFileContent('package.json', { name: 'myProjectName', description: 'myProjectName' });
    });
});

test("replace projectName's blank with -", (done) => {
    helpers
        .run(generatorPath)
        .withPrompts({
            projectName: 'hello world',
        })
        .then(() => {
            assert.fileContent('readme.md', '# hello-world');
            done();
        });
});

describe('init Git', () => {
    beforeAll((done) => {
        helpers
            .run(generatorPath)
            .withPrompts({
                initGit: true,
                projectName: 'test_init_git',
            })
            .on('end', done);
    });
    test('deps is right', () => {
        return expect(readPkgJsonContent()).resolves.toMatchSnapshot();
    });
});

describe('select framework None', () => {
    beforeAll((done) => {
        helpers
            .run(generatorPath)
            .withPrompts({
                projectName: 'test_none_framework',
            })
            .on('end', done);
    });
    test('deps is right', () => {
        return expect(readPkgJsonContent()).resolves.toMatchSnapshot();
    });
    test('created expected files', () => {
        assert.noFile(['src/logger.js', 'src/router.js']);
    });
    test('creates expected npm scripts', () => {
        assert.fileContent('package.json', '"coverage": "jest --coverage"');
        assert.fileContent('package.json', '"lint": "eslint --fix --ext .js ."');
        assert.fileContent('package.json', '"test": "jest"');
        assert.fileContent('package.json', '"dev": "nodemon main"');
    });

    test('main.js is empty', () => {
        assert.fileContent('main.js', 'hello world');
    });
});

describe('select framework Koa', () => {
    beforeAll((done) => {
        helpers
            .run(generatorPath)
            .withPrompts({
                projectName: 'Koa',
            })
            .on('end', done);
    });
    test('deps is right', () => {
        return helpers
            .run(generatorPath)
            .withPrompts({
                framework: 'Koa',
                projectName: 'test_koa_framework',
            })
            .then(() => expect(readPkgJsonContent()).resolves.toMatchSnapshot());
    });

    test('creates expected npm scripts', () => {
        assert.fileContent('package.json', '"coverage": "jest --coverage"');
        assert.fileContent('package.json', '"lint": "eslint --fix --ext .js ."');
        assert.fileContent('package.json', '"test": "jest"');
        assert.fileContent('package.json', '"dev": "nodemon main"');
    });
    test('creates expected files', () => {
        assert.file(['src/logger.js', 'src/router.js']);
    });
    test('main.js is koa file', () => {
        assert.fileContent('main.js', 'koa');
    });
});

describe('include graphql', () => {
    beforeAll((done) => {
        helpers
            .run(generatorPath)
            .withPrompts({
                framework: 'Koa',
                includeGraphql: true,
            })
            .on('end', done);
    });
    test('router include graphql path', () => {
        assert.fileContent('src/router.js', `const gqlMiddlewave = require('./graphql');`);
        assert.fileContent('src/router.js', 'rootRouter.post(gqlMiddlewave.path, gqlMiddlewave);');
    });
    test('creates expected files', () => {
        assert.file([
            'src/graphql/index.js',
            'src/graphql/resolvers.js',
            'schema.graphql',
            'codegen.yml',
            '.graphqlrc.yaml',
        ]);
    });
    test('deps is right', () => {
        assert.jsonFileContent('package.json', {
            dependencies: {
                'apollo-server-koa': '^2.18.x',
                graphql: '^15.3.x',
            },
            devDependencies: {
                '@graphql-codegen/cli': '^1.17.x',
                '@graphql-codegen/typescript-type-graphql': '^1.17.x',
                typescript: '^4.0.x',
            },
        });
    });
    test('readme has codegen desc', () => {
        assert.fileContent('readme.md', '# generate graphqlSchema.d.ts from codegen.yml');
        assert.fileContent('readme.md', 'npm run graphql-codegen');
    });
    test('creates expected npm scripts', () => {
        assert.jsonFileContent('package.json', {
            scripts: {
                'graphql-codegen': 'graphql-codegen',
            },
        });
    });
});
