/**
 * @module services/speaker
 */
const player = require('play-sound')(opts = {});
const AbstractModule = require('../core/abstract-module');

/** speaker module */
class Speaker extends AbstractModule {

    constructor() {
        super();

        this._speaking = false;
        this._queue = [];

    }

    say(message) {

        marytts.textToSpeech(message, (message, filePath) => {

            this._queue.push({
                message: message,
                filePath: filePath
            });

            this._speak();

        })
    }

    _speak() {
        if(this._speaking || 0 == this._queue.length) return false;

        this._speaking = true;

        let entry = this._queue.shift();

        player.play(entry.filePath, (error) => {
            if (error) {
                new Exception(error);
            } else {
                this.logger.debug(entry.message);
                this._speaking = false;
                this._speak();
            }
        });
    }

}

module.exports = Speaker;