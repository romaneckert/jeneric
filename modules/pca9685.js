const AbstractModule = require('../core/abstract-module');
const I2C = require('i2c');

/** pca9685 module */
class PCA9685 extends AbstractModule {
    constructor() {
        address = 0x40
        mode1 = 0x00
        mode2 = 0x01
        prescale = 0xFE
    }
}

module.exports = PCA9685;