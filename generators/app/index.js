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
    initializing() {}
    async prompting() {
        this.answers = await this.prompt([
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
        ]);
    }
    /**
     * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     */
    configuring() {}
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
        if (this.answers.framework == 'Koa') {
            this.fs.writeJSON(
                this.destinationPath('package.json'),
                this.fs.readJSON(this.destinationPath('package.json')),
                (key, value) => {
                    switch (key) {
                        case 'dependencies':
                            return Object.assign(value, config.deps.Koa.dependencies);
                        case 'devDependencies':
                            return Object.assign(value, config.deps.Koa.devDependencies);
                        default:
                            return value;
                    }
                },
                4
            );
            this.fs.copy(this.templatePath(config.mainJs.Koa), this.destinationPath('main.js'));
            config.extraFilesToCopy.Koa.forEach((file) => {
                this.fs.copy(this.templatePath(file), this.destinationPath(file));
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
        this.log('enjoy coding!');
    }
};
