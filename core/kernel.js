const fs = require('fs');
const path = require('path');
const Emitter = require('events');

const Logger = require('../modules/logger');
//const Speaker = require('../service/speaker');
//const MaryTTS = require('../service/marytts');

/** kernel class generates all instances */
class Kernel {

    constructor() {

        let rootPath = path.dirname(require.main.filename);

        // set default config
        this._config = {
            path : {
                root : rootPath + '/',
                app : rootPath + '/app/',
                public : rootPath + '/public/',
                config : rootPath + '/app/config/config.json',
                logs : rootPath + '/var/logs/',
            }
        };

        // override some config settings from config file
        if(fs.existsSync(this._config.path.config)) {
            let jsonConfig = JSON.parse(fs.readFileSync(this._config.path.config, 'utf8'));

            for(let entry in jsonConfig) {
                this._config[entry] = jsonConfig[entry];
            }
        }

        this._modules = {};

        // create core modules
        this.logger = new Logger(this._config.path.logs);

        // create app modules
        for(let module in this._config.modules) {
            let moduleClass = require(this._config.path.app + 'component/' + this._config.components[component].path);
            this._modules[modules] = new moduleClass();
        }

    }

    get config() {
        return this._config;
    }

    get modules() {
        return this._components;
    }

}

module.exports = new Kernel();