const fs = require('fs-extra');
const strftime = require('strftime');
const config = require('jeneric/core/config');

class Logger {

    constructor() {
        this._config = {
            directory: 'var/logs/'
        };

        if(config.logger) this._config = config.logger;

        if(!fs.existsSync(config.path.root + this._config.directory)) {
            fs.mkdirSync(config.path.root + this._config.directory);
        }

        if(!fs.existsSync(config.path.root + this._config.directory + 'log.log')) {
            fs.writeFileSync(config.path.root + this._config.directory + 'log.log');
        }

    }

    debug(data, meta) {
        this._log(data, meta, 'debug');
    }

    info(data, meta) {
        this._log(data, meta, 'info');
    }

    error(data, meta) {
        this._log(data, meta, 'error');
    }

    _log(data, meta, type) {

        let date = new Date();

        switch(typeof data) {
            case 'string':
                data = data.split("\n");
                break;
            case 'object':
                data = String(data);
                break;
            default:
                throw new Error('logger not defined for type "' + typeof data + '" and message "' + String(data) + '"');
                break;
        }

        for (let line of data) {
            if(line) {

                let message = '[' + strftime('%F %T', date) + ']';
                message += ' [' + type + ']';
                message += ' ' + line;
                if(meta) message += ' [' + String(meta) + ']';
                message += ' [' + new Error().stack.split("at ")[3].match(/\w+\.js:\d+:\d+/g)[0] + ']';
                message += '\r\n';

                if('error' == type) {
                    fs.appendFileSync(
                        this._config.directory + 'log.log',
                        message
                    )
                } else {
                    fs.appendFile(
                        this._config.directory + 'log.log',
                        message,
                        (error) => { if (error) throw error; }
                    );
                }
            }
        }
    }
}

module.exports = new Logger();