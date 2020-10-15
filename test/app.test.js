const path = require('path');
const helpers = require('yeoman-test');
const fs = require('fs');

describe('app', () => {
    const generatorPath = path.join(__dirname, '../generators/app');
    test('run sucess', () => expect(helpers.run(generatorPath)).resolves.toBeTruthy());
    test('creates expected files', () => {
        return helpers
            .run(generatorPath)
            .then(() =>
                Promise.all(
                    [
                        '.eslintignore',
                        '.eslintrc',
                        '.gitignore',
                        'jsconfig.json',
                        '.prettierrc',
                        'index.js',
                        '.huskyrc.js',
                        'jest.config.js',
                        'src',
                        'test',
                    ].map((file) => expect(fs.promises.stat(file)).resolves.toBeTruthy())
                )
            );
    });
    test('projectName is rendered', () => {
        return helpers
            .run(generatorPath)
            .withPrompts({
                projectName: 'myProjectName',
            })
            .then(() =>
                Promise.all([
                    expect(fs.promises.readFile('package.json', 'utf8').then(JSON.parse)).resolves.toMatchObject({
                        name: 'myProjectName',
                        description: 'myProjectName',
                    }),
                    expect(fs.promises.readFile('readme.md', 'utf8')).resolves.toMatch(/# myProjectName/),
                ])
            );
    });
    test('has git', () => {
        return helpers
            .run(generatorPath)
            .then(() => expect(fs.promises.stat('.git').then((s) => s.isDirectory())).resolves.toBeTruthy());
    });
});
