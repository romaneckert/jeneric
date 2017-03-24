const fs = require('fs-extra');
const player = require('play-sound')(opts = {});
const config = require('jeneric/core/config');
const marytts = require('jeneric/module/marytts');
const logger = require('jeneric/module/logger');

class Speaker {

    constructor() {

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
                logger.error(error);
                throw error;
            } else {
                logger.debug(entry.message);
                this._speaking = false;
                this._speak();
            }
        });
    }

}

module.exports = new Speaker();