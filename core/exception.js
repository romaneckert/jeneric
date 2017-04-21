const logger = require('jeneric/module/logger');

class Exception {
    constructor(error) {

        error = String(error);
        logger.error(error);
        throw new Error(error)

    }
}

module.exports = Exception;