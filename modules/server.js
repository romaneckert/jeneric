const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const io = require('socket.io');
const AbstractModule = require('../core/abstract-module');

/** server module */
class Server extends AbstractModule {

    constructor(directory) {

        super();

        this._directory = directory;

        this._mimeTypes = {
            css:    'text/css',
            gif:    'image/gif',
            html:   'text/html',
            jpg:    'image/jpeg',
            js:     'application/x-javascript',
            mp3:    'audio/mpeg',
            pdf:    'application/pdf',
            png:    'image/png',
            svg:    'image/svg+xml'
        };

        this._server = http.createServer(this._handleRequest.bind(this));
        this._server.listen(3000);

        this._io = io(this._server);
    }

    setConnectionCallback(callback) {
        this._io.on('connection', callback);
    }

    _handleRequest(request, response) {

        this.modules.logger.debug(request.method + ': ' + request.url);

        let parsedUrl = url.parse(request.url);
        let pathname = path.join(this.config.path.root, this._directory, parsedUrl.pathname);

        console.error(pathname);

        if(!fs.existsSync(pathname)) {
            this.modules.logger.debug('Not found: ' + pathname);
            response.statusCode = 404;
            response.end('Not found.');
            return false;
        }

        if(fs.statSync(pathname).isDirectory()) pathname += '/index.html';

        if(!fs.existsSync(pathname)) {
            this.modules.logger.debug('Not found: ' + pathname);
            response.statusCode = 404;
            response.end('Not found.');
            return false;
        }

        fs.readFile(pathname, (error, data) => {
            if (error) {
                this.modules.logger.debug('Not found: ' + pathname);
                response.statusCode = 404;
                response.end('Not found.');
                return false;
            } else {
                let ext = path.extname(pathname).replace('.', '');

                if ('string' === typeof this._mimeTypes[ext]) {
                    response.setHeader('Content-type', this._mimeTypes[ext] || 'text/plain');
                    response.end(data);
                } else {
                    response.statusCode = 500;
                    response.end('Error getting the file. mime type not supported.');
                }
            }
        });

        return true;
    }
}

module.exports = Server;