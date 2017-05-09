/** all classes extends the abstract class.
 * @abstract
 */
class Abstract {

    constructor() {
        this._kernel = null;
    }

    /**
     * the application kernel
     * @protected
     * @returns {Kernel}
     */
    get kernel() {
        if(null === this._kernel) {
            this._kernel = require('./kernel');
        }
        return this._kernel;
    }

    /**
     * all registered components
     *
     * @protected
     */
    get modules() {
        return this.kernel.modules;
    }

}

module.exports = Abstract;