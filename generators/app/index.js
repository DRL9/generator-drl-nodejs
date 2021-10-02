const Generator = require('yeoman-generator');
const utils = require('./utils');
const config = require('./config');

module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
        this.argument('projectName', {
            type: String,
            description: 'project name',
            required: false,
        });
    }
    /**
     * Your initialization methods (checking current project state, getting configs, etc)
     */
    initializing() {
        this.answers = {
            projectName: this.appname,
            framework: 'None',
            includeGraphql: false,
            npmClient: 'npm',
        };
    }
    async prompting() {
        Object.assign(
            this.answers,
            await this.prompt([
                {
                    type: 'input',
                    name: 'projectName',
                    message: 'Project Name',
                    default: this.appname,
                },
                {
                    type: 'list',
                    name: 'framework',
                    message: 'framework',
                    choices: ['None', 'Koa'],
                    default: 'None',
                },
                {
                    type: 'confirm',
                    name: 'initGit',
                    message: 'init git?',
                    default: true,
                },
                {
                    type: 'list',
                    name: 'npmClient',
                    message: 'which npm client',
                    choices: ['npm', 'yarn'],
                    default: 'npm',
                },
            ])
        );
        this.answers.projectName = this.answers.projectName.replace(/ /g, '-');
        if (this.answers.framework === 'Koa') {
            Object.assign(
                this.answers,
                await this.prompt({
                    type: 'confirm',
                    name: 'includeGraphql',
                    message: 'include graphql',
                    default: false,
                })
            );
        }
        if (this.answers.includeGraphql) {
            this.composeWith(require.resolve('../graphql'));
        }
        this.env.options.nodePackageManager = this.answers.npmClient;
    }
    /**
     * Where you write the generator specific files (routes, controllers, etc)
     */
    async writing() {
        // copy 写死的配置文件
        config.filesToCopy.forEach((file) => {
            this.fs.copy(this.templatePath(file), this.destinationPath(/^_/.test(file) ? file.slice(1) : file));
        });
        config.filesToRender.forEach((file) => {
            this.fs.copyTpl(
                this.templatePath(file),
                this.destinationPath(/^_/.test(file) ? file.slice(1) : file),
                this.answers
            );
        });
        const deps = {};

        const devDeps = await utils.assignLatestVersion({
            '@types/jest': '^26.0.14',
            eslint: '^7.11.0',
            'eslint-config-prettier': '^6.12.0',
            'eslint-plugin-jest': '^24.1.0',
            'eslint-plugin-prettier': '^3.1.4',
            jest: '^26.5.3',
            prettier: '^2.1.2',
        });
        if (this.answers.framework == 'Koa') {
            Object.assign(
                deps,
                await utils.assignLatestVersion({
                    '@koa/cors': '^3.1.0',
                    '@koa/router': '^9.4.0',
                    koa: '^2.13.0',
                    'koa-bodyparser': '^4.3.0',
                    winston: '^3.3.3',
                    'winston-daily-rotate-file': '^4.5.0',
                    chalk: '^4.1.0',
                })
            );
            Object.assign(devDeps, {
                nodemon: '^2.0.4',
            });

            this.fs.copy(this.templatePath(config.mainJs.Koa), this.destinationPath('main.js'));
            config.extraFilesToCopy.Koa.forEach((file) => {
                this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), this.answers);
            });
        }
        if (this.answers.initGit) {
            if (process.env.NODE_ENV !== 'test') {
                this.spawnCommandSync('git', ['init', '--quiet'], {
                    cwd: this.destinationPath(),
                });
            }
            this.fs.extendJSON(this.destinationPath('package.json'), {
                scripts: {
                    postinstall: 'husky install',
                },
            });
            Object.assign(devDeps, {
                husky: '^6.0.0',
            });
            this.fs.copy(this.templatePath('.husky'), this.destinationPath('.husky'));
            this.fs.copy(this.templatePath('.husky/.gitignore'), this.destinationPath('.husky/.gitignore'));
        }
        await this.addDevDependencies(devDeps);
        await this.addDependencies(deps);
    }
    end() {
        if (process.env.NODE_ENV !== 'test') {
            this.spawnCommandSync('npm', ['run', 'lint'], {
                cwd: this.destinationPath(),
            });
        }

        this.log('enjoy coding!');
    }
};
