const fs = require('fs');
const strftime = require('strftime');
const AbstractModule = require('../core/abstract-module');

/** logger module */
class Logger extends AbstractModule {

    constructor(directory, consoleLevels) {

        super();

        this._directory = directory;
        this._consoleLevels = consoleLevels;

        if(!fs.existsSync(this._directory)) fs.mkdirSync(this._directory);

        if(!fs.existsSync(this._directory + 'debug.log')) fs.writeFileSync(this._directory + 'debug.log', '');
        if(!fs.existsSync(this._directory + 'info.log')) fs.writeFileSync(this._directory + 'info.log', '');
        if(!fs.existsSync(this._directory + 'error.log')) fs.writeFileSync(this._directory + 'error.log', '');

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
                data = [JSON.stringify(data)];
                break;
            default:
                data = [String(data)];
                break;
        }

        switch(typeof meta) {
            case 'object':
                meta = JSON.stringify(meta);
                break;
            case 'undefined':
                meta = null;
                break;
            default:
                meta = String(meta);
                break;
        }

        for (let line of data) {
            if(line) {

                let message = '[' + strftime('%F %T', date) + ']';
                message += ' [' + type + ']';
                message += ' ' + line;
                if(null !== meta) message += ' [' + meta + ']';
                message += ' [' + new Error().stack.split("at ")[3].match(/\w+\.js:\d+:\d+/g)[0] + ']';

                switch(type) {
                    case 'debug':

                        if(-1 !== this._consoleLevels.indexOf(type)) console.log(message);

                        fs.appendFileSync(
                            this._directory + 'debug.log',
                            message + '\n'
                        );
                        break;
                    case 'info':

                        if(-1 !== this._consoleLevels.indexOf(type)) console.info(message);

                        fs.appendFileSync(
                            this._directory + 'debug.log',
                            message + '\n'
                        );

                        fs.appendFileSync(
                            this._directory + 'info.log',
                            message + '\n'
                        );

                        break;
                    case 'error':

                        if(-1 !== this._consoleLevels.indexOf(type)) console.error(message);

                        fs.appendFileSync(
                            this._directory + 'debug.log',
                            message + '\n'
                        );

                        fs.appendFileSync(
                            this._directory + 'info.log',
                            message + '\n'
                        );

                        fs.appendFileSync(
                            this._directory + 'error.log',
                            message + '\n'
                        );
                        break;
                }
            }
        }
    }
}

module.exports = Logger;