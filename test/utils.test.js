const utils = require('../generators/app/utils');

test('getPkgLatestVersion()', () => {
    return expect(utils.getPkgLatestVersion('npm')).resolves.toMatch(/^(\d+\.){2}\d+$/);
});

test('assignLatestVersion()', () => {
    return expect(utils.assignLatestVersion({ npm: '6.0.0', koa: '2.0.0' })).resolves.toHaveProperty('npm');
});
