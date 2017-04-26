class Abstract {

    constructor() {
        this._kernel = null;
    }

    get kernel() {
        if(null === this._kernel) {
            this._kernel = require('./kernel');
        }
        return this._kernel;
    }

    get services() {
        return this.kernel.services;
    }

}

module.exports = Abstract;