const http = require("http");
const url = require('url');
const config = require('jeneric/core/config');
const fs = require('fs-extra');
const logger = require('jeneric/module/logger');
const path = require('path');

class Server {

    constructor() {

        this._config = config.merge({
            path : 'public'
        });

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

    }

    _handleRequest(request, response) {

        logger.debug(request.method + ': ' + request.url);

        const parsedUrl = url.parse(request.url);

        let pathname = './' + this._config.path + parsedUrl.pathname;

        fs.exists(pathname, (exist) => {
            if(!exist) {
                logger.error('Not found: ' + pathname);
                response.statusCode = 404;
                response.end('Not found.');
                return true;
            }

            if (fs.statSync(pathname).isDirectory()) pathname += '/index.html';

            fs.readFile(pathname, (error, data) => {
                if(error){
                    logger.error('Not found: ' + pathname);
                    response.statusCode = 404;
                    response.end('Not found.');
                } else {
                    const ext = path.extname(pathname).replace('.', '');

                    if('string' === typeof this._mimeTypes[ext]) {
                        response.setHeader('Content-type', this._mimeTypes[ext] || 'text/plain' );
                        response.end(data);
                    } else {
                        response.statusCode = 500;
                        response.end('Error getting the file. mime type not supported.');
                    }
                }
            });
        });

    }

}

module.exports = new Server();