const childProgress = require('child_process');

async function getPkgLatestVersion(pkgName) {
    return new Promise((resolve, reject) => {
        childProgress.exec(`npm show ${pkgName} version`, (err, output) => {
            if (err) {
                return reject(err);
            }
            resolve(output.trim());
        });
    });
}

async function assignLatestVersion(pkgs) {
    return (
        await Promise.all(Object.keys(pkgs).map(async (pkg) => ({ [pkg]: await getPkgLatestVersion(pkg) })))
    ).reduce((pre, cur) => Object.assign(pre, cur), {});
}
module.exports = {
    getPkgLatestVersion,
    assignLatestVersion,
};
