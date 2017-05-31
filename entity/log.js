const AbstractEntity = require('../core/abstract-entity');
const strftime = require('strftime');

class Log extends AbstractEntity {

    constructor(message, type, callStack, meta) {

        super();

        this._date = new Date();
        this._message = message;
        this._type = type;
        this._callStack = callStack;
        this._meta = meta;

        let script = this._callStack.split("at ")[3].match(/\w+\.js/g)[0];
        let scriptWithLineNumber = this._callStack.split("at ")[3].match(/\w+\.js:\d+:\d+/g)[0];

        this._module = script.replace('.js', '');

        this._longMessage = '[' + strftime('%F %T', this._date) + ']';
        this._longMessage += ' [' + this._type + ']';
        this._longMessage += ' [' + this._module + ']';
        this._longMessage += ' ' + this._message;
        if(null !== this._meta) this._longMessage += ' [' + this._meta + ']';
        this._longMessage += ' [' + scriptWithLineNumber + ']';

    }

    get message() {
        return this._message;
    }

    get type() {
        return this._type;
    }

    get callstack() {
        return this._callStack;
    }

    get meta() {
        return this._meta;
    }

    get module() {
        return this._module;
    }

    get longMessage() {
        return this._longMessage;
    }

}

module.exports = Log;