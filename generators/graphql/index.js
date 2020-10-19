const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }
    writing() {
        const filesToCopy = ['schema.graphql', 'codegen.yml', 'src', '.graphqlrc.yaml'];
        filesToCopy.forEach((file) => {
            this.fs.copy(this.templatePath(file), this.destinationPath(file));
        });

        this.fs.extendJSON(this.destinationPath('package.json'), {
            scripts: {
                'graphql-codegen': 'graphql-codegen',
            },
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
    }
};
