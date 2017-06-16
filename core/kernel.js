const fs = require('fs');
const path = require('path');
const merge = require('merge');
const Utils = require('./utils');

/** kernel class generates all module instances */
class Kernel {

    constructor() {

        // get root path of application
        let rootPath = path.dirname(require.main.filename);

        // get default config
        this._defaultConfig = require('../config/config.json');

        // get application config
        let pathToAppConfig = path.join(rootPath, 'app/config/config.json');

        if(fs.existsSync(pathToAppConfig)) {
            this._appConfig = require(pathToAppConfig);

            // merge default config with app config
            this._config = merge.recursive(this._defaultConfig, this._appConfig);
        } else {
            this._config = this._defaultConfig;
        }
        
        // add path informations to config
        this._config.path = {
            root : rootPath,
            app : path.join(rootPath, 'app'),
        };

        // create app modules
        this._modules = {};

        for(let module in this._config.modules) {

            // check if module is active
            let active = this._config.modules[module].active;
            if(true !== active) continue;

            let pathToModule = path.join(this._config.path.app, 'modules', module + '.js');

            // check if module is an app module, if not module is an core module
            if(!fs.existsSync(pathToModule, '.js')) {
                pathToModule = path.join(__dirname, '/../modules/', module + '.js');
            }

            // check if module exists
            if(!fs.existsSync(pathToModule)) console.error('module does not exists: ' + pathToModule);

            // get args for generate module instances
            let moduleArguments = this._config.modules[module]['args'];

            let args = [];

            for(let moduleArgument in moduleArguments) args.push(moduleArguments[moduleArgument]);

            // create instance of module
            let moduleClass = require(pathToModule);
            this._modules[Utils.snakeCaseToCamelCase(module)] = eval("new moduleClass('" + args.join("','") + "')");

        }

    }

    get config() {
        return this._config;
    }

    get modules() {
        return this._modules;
    }

}

module.exports = new Kernel();