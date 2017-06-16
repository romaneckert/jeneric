const AbstractModule = require('../core/abstract-module');
const i2c = require('i2c-bus');
const sleep = require('sleep');

// used https://github.com/johntreacy/adafruit-pca9685
/** pca9685 module */
class PCA9685 extends AbstractModule {

    constructor() {

        super();

        this._frequence = 50;
        this._address = 0x40;
        this._mode1 = 0x00;
        this._prescale = 0xFE;
        this._correctionFactor = 1.0;

        this._i2c = i2c.openSync(1);

        this.setAllPwm(0,0);
        this._i2c.writeByteSync(this._address, this._mode1, 0x00);
        this.setPwmFreq();
    }

    setPwmFreq() {

        let prescaleval = 25000000;
        prescaleval /= 4096.0;
        prescaleval /= this._frequence;
        prescaleval -= 1.0;

        let prescale = Math.floor(prescaleval * this._correctionFactor + 0.5);

        let oldmode = this._i2c.readByteSync(this._address, this._mode1, 1);
        let newmode = (oldmode & 0x7F) | 0x10;

        this._i2c.writeByteSync(this._address, this._mode1, newmode);
        this._i2c.writeByteSync(this._address, this._prescale, prescale);
        this._i2c.writeByteSync(this._address, this._mode1, oldmode);
        sleep.msleep(10);
        this._i2c.writeByteSync(this._address, this._mode1, oldmode | 0x80);

    }

    setPwm(channel, on, off) {
        this._i2c.writeByteSync(this._address, 0x06 + 4 * channel, on & 0xFF);
        this._i2c.writeByteSync(this._address, 0x07 + 4 * channel, on >> 8);
        this._i2c.writeByteSync(this._address, 0x08 + 4 * channel, off & 0xFF);
        this._i2c.writeByteSync(this._address, 0x09 + 4 * channel, off >> 8);
    }

    setAllPwm(on, off) {
        this._i2c.writeByteSync(this._address, 0xFA, on & 0xFF);
        this._i2c.writeByteSync(this._address, 0xFB, on >> 8);
        this._i2c.writeByteSync(this._address, 0xFC, off & 0xFF);
        this._i2c.writeByteSync(this._address, 0xFD, off >> 8);
    }
}

module.exports = PCA9685;