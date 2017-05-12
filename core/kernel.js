const fs = require('fs');
const path = require('path');
const merge = require('merge');

/** kernel class generates all module instances */
class Kernel {

    constructor() {

        // get rootpath of application
        let rootPath = path.dirname(require.main.filename) + '/';

        // get default config
        this._defaultConfig = require('../config/config.json');

        // get application config
        this._appConfig = require(rootPath + 'app/config/config.json');

        // merge default config with app config
        this._config = merge.recursive(this._defaultConfig, this._appConfig);

        // add path informations to config
        this._config.path = {
            root : rootPath,
            app : rootPath + 'app/',
        };

        // create app modules
        this._modules = {};

        for(let module in this._config.modules) {

            // check if module is active
            let active = this._config.modules[module].active;
            if(true !== active) continue;

            let pathToModule = this._config.path.app + 'modules/' + module;

            // check if module is an app module, if not module is an core module
            if(!fs.existsSync(pathToModule + '.js')) {
                pathToModule = __dirname + '/../modules/' + module
            }

            // check if module exists
            if(!fs.existsSync(pathToModule + '.js')) console.error('module does not exists: ' + pathToModule + '.js');

            // get args for generate module instances
            let moduleArguments = this._config.modules[module]['args'];

            let args = [];

            for(let moduleArgument in moduleArguments) args.push(moduleArguments[moduleArgument]);

            // create instance of module
            let moduleClass = require(pathToModule);
            this._modules[module] = eval("new moduleClass('" + args.join("','") + "')");

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