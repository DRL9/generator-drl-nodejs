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
            // {
            //     type: 'confirm',
            //     name: 'includeJest',
            //     message: 'use Jest',
            //     default: true,
            // },
            {
                type: 'input',
                name: 'projectName',
                message: 'Project Name',
                default: this.appname,
            },
        ]);
    }
    /**
     * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     */
    configuring() {}
    // 自定义任务放到下面
    method1() {}
    /**
     * Where you write the generator specific files (routes, controllers, etc)
     */
    async writing() {
        // copy 写死的配置文件
        config.filesToCopy.forEach((file) => {
            this.fs.copy(this.templatePath(file), this.destinationPath(file.slice(1)));
        });
        config.filesToRender.forEach((file) => {
            this.fs.copyTpl(this.templatePath(file), this.destinationPath(file.slice(1)), this.answers);
        });
    }
    install() {
        this.npmInstall();
    }
    end() {
        this.log('enjoy coding!');
    }
};
