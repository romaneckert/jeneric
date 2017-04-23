const kernel = require('./kernel');

class Abstract {

    constructor() {

    }

    get logger() {
        return kernel.logger;
    }

}

module.exports = Abstract;