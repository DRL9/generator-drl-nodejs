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
                    ['.eslintignore', '.eslintrc', '.gitignore', 'jsconfig.json', '.prettierrc', 'app.js'].map((file) =>
                        expect(fs.promises.stat(file)).resolves.toBeTruthy()
                    )
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
                    }),
                    expect(fs.promises.readFile('readme.md', 'utf8')).resolves.toMatch(/# myProjectName/),
                ])
            );
    });
});
