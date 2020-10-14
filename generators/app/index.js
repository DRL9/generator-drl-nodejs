const Generator = require('yeoman-generator');

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
                type: 'confirm',
                name: 'includeJest',
                message: 'use Jest',
                default: true,
            },
        ]);
    }
    /**
     * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     */
    configuring() {
        this.log(this.destinationRoot());
        this.log(this.templatePath());
        this.log(this.sourceRoot());
    }
    // 自定义任务放到下面
    method1() {}
    /**
     * Where you write the generator specific files (routes, controllers, etc)
     */
    writing() {
        this.fs.copyTpl;
    }
    install() {}
    end() {
        this.log('end');
    }
};
