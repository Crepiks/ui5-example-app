const babel = require('@babel/core');
const pathregen = require('regenerator-runtime/path').path;
const resourceFactory = require('@ui5/fs').resourceFactory;
const fs = require('fs');

module.exports = async function ({ workspace, dependencies, options }) {
    const jsResources = await workspace.byGlob('**/*.js');

    const componentResource = jsResources.find((jsResource) => jsResource.getPath().includes('Component.js'));
    const toPath = componentResource.getPath();
    const pathPrefix = toPath.replace('Component.js', '');
    const pathRegenerator = pathregen.substr(pathregen.indexOf('node_modules') + 13).replace('\\', '/');
    const virtualPathRegenerator = pathPrefix + pathRegenerator;
    const runtimeCode = fs.readFileSync(pathregen, 'utf-8');
    const runtimeResource = resourceFactory.createResource({
        path: virtualPathRegenerator,
        string: runtimeCode
    });

    // save regenerator to workspace
    await workspace.write(runtimeResource);

    // add require regenerator for development prupose
    let componentSource = await componentResource.getString();
    const requirePath = virtualPathRegenerator.replace('/resources/', '').replace('.js', '');
    componentSource = '// development mode: load the regenerator runtime synchronously\nif(!window.regeneratorRuntime){sap.ui.requireSync("' + requirePath + '")}' + componentSource;
    componentResource.setString(componentSource);
    await workspace.write(componentResource);

    const filteredResources = jsResources.filter(resource => {
        return (!resource.getPath().includes('/libs/'));
    });

    const transformCode = async resource => {
        const source = await resource.getString();
        const { code } = babel.transformSync(source, {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            'browsers': [
                                'last 2 versions',
                                'IE >= 11'
                            ]
                        }
                    }
                ]
            ],
            plugins: [
                ['@babel/plugin-transform-modules-commonjs', { 'strictMode': false }]
            ]
        });
        resource.setString(code);
        return resource;
    };

    const transformedResources = await Promise.all(filteredResources.map(resource => transformCode(resource)));
    await Promise.all(transformedResources.map((resource) => {
        return workspace.write(resource);
    }));
};
