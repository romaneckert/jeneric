/**
 * @module services/marytts
 */
const spawn = require('child_process').spawn;
const querystring = require('querystring');
const http = require('http');
const slug = require('slug');
const fs = require('fs');
const AbstractModule = require('../core/abstract-module');

/** marytts module */
class MaryTTS extends AbstractModule {

    constructor(directory, host, port, bin) {

        super();

        this._directory = directory;
        this._host = host;
        this._port = port;
        this._bin = bin;

        this._running = false;
        this._starting = false;

        if(!fs.existsSync(this._directory)) fs.mkdirSync(this._directory);
    }

    get running() {
        return this._running;
    }

    get starting() {
        return this._starting;
    }

    _startServer() {
        this.modules.logger.info('Start MaryTTS Server');

        let child = spawn('./' + this._bin, {
            detached: true
        });

        child.stdout.on('data', (data) => {
            this.modules.logger.debug(data.toString());
        });

        child.stderr.on('data', (data) => {
            if(data.toString().includes('started in') && data.toString().includes('on port')) this._running = true;
            this.modules.logger.debug(data.toString());
        });

        child.on('close', (code) => {
            this.modules.logger.debug('child process exited with code: ' + code);
        });

        child.unref();
    }

    textToSpeech(message, callback) {

        let filePath = this._directory + slug(message, {lower: true}) + '.wav';
        if(fs.existsSync(filePath)) {
            callback(message, filePath);
            return true;
        }

        let params = {
            'INPUT_TEXT' : message,
            'INPUT_TYPE': 'TEXT',
            'OUTPUT_TYPE' : 'AUDIO',
            'AUDIO' : 'WAVE_FILE',
            'LOCALE' : 'de',
            'effect_Chorus_selected' : 'on',
            'effect_Chorus_parameters' : 'delay1:466;amp1:0.54;delay2:600;amp2:-0.10;delay3:250;amp3:0.30'
        };

        let queryString = querystring.stringify(params);
        let url = 'http://' + this._host + ':' + this._port + '/process?' + queryString;

        let errorMessage = 'can not get message from marytts server for url: ' + url;

        http.get(url, (response) => {

            if(response && 200 === response.statusCode) {

                let file = fs.createWriteStream(filePath);

                file.on('finish', () => {

                    this.modules.logger.debug('generate file ' + filePath);

                    file.close(() => {
                        callback(message, filePath);
                    });
                });

                response.pipe(file);

            } else {
                this.modules.logger.error(errorMessage);
                throw errorMessage;
            }

        }).on('error', (errorMessage) => {
            this.modules.logger.error(errorMessage);
            throw errorMessage;
        });

        return true;

    }

    start() {

        if(this._starting) return false;

        this._starting = true;
        this._running = false;

        http.get('http://' + this._host + ':' + this._port + '/version', (response) => {

            if(response && 200 === response.statusCode) {
                this._running = true;
                this._starting = false;
            } else {
                this._startServer();
            }

        }).on('error', (error) => {
            this._startServer();
        });

    }
}

module.exports = MaryTTS;