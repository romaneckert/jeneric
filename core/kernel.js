const fs = require('fs');
const path = require('path');

const Logger = require('../service/logger');
//const Speaker = require('../service/speaker');
//const MaryTTS = require('../service/marytts');

class Kernel {

    constructor() {

        let rootPath = path.dirname(require.main.filename);

        this._config = {
            path : {
                root : rootPath + '/',
                app : rootPath + '/app/',
                public : rootPath + '/public/',
                config : rootPath + '/app/config/config.json',
                logs : rootPath + '/var/logs/',
            }
        };

        if(fs.existsSync(this._config.path.config)) {
            let jsonConfig = JSON.parse(fs.readFileSync(this._config.path.config, 'utf8'));

            for(let entry in jsonConfig) {
                this._config[entry] = jsonConfig[entry];
            }
        }

        this._services = {};
        this._services.logger = new Logger(this._config.path.logs);

    }

    get config() {
        return this._config;
    }

    get services() {
        return this._services;
    }

}

module.exports = new Kernel();