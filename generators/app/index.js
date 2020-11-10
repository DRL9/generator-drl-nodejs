const Generator = require('yeoman-generator');
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
    }
    /**
     * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     */
    configuring() {}
    /**
     * Where you write the generator specific files (routes, controllers, etc)
     */
    writing() {
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
        if (this.answers.framework == 'Koa') {
            this.fs.extendJSON(this.destinationPath('package.json'), config.deps.Koa);
            this.fs.copy(this.templatePath(config.mainJs.Koa), this.destinationPath('main.js'));
            config.extraFilesToCopy.Koa.forEach((file) => {
                this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), this.answers);
            });
        }
        this.spawnCommandSync('git', ['init', '--quiet'], {
            cwd: this.destinationPath(),
        });
    }
    install() {
        this.npmInstall();
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
