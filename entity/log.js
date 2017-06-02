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
    }

    get script() {
        return this.callStack.split("at ")[3].match(/\w+\.js/g)[0];
    }

    get scriptWithLineNumber() {
        return this.callStack.split("at ")[3].match(/\w+\.js:\d+:\d+/g)[0];
    }

    get date() {
        return this._date;
    }

    get message() {
        return this._message;
    }

    get type() {
        return this._type;
    }

    get callStack() {
        return this._callStack;
    }

    get meta() {
        return this._meta;
    }

    get module() {
        return this.script.replace('.js', '');
    }

    get longMessage() {
        let longMessage = '[' + strftime('%F %T', this.date) + ']';
        longMessage += ' [' + this.type + ']';
        longMessage += ' [' + this.module + ']';
        longMessage += ' ' + this.message;
        if(null !== this.meta) longMessage += ' [' + this.meta + ']';
        longMessage += ' [' + this.scriptWithLineNumber + ']';
        return longMessage;
    }

}

module.exports = Log;