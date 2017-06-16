#!/usr/bin/env node

const Application = require('../../core/application');
const sleep = require('sleep');

class PCA9685Test extends Application {

    constructor() {
        
        super();

        this.testPwmOnChannel0();
    }

    testPwmOnChannel0() {

        console.log('loop');
        this.modules.pca9685.setPwm(0, 0, 400);
        sleep.msleep(1000);
        this.modules.pca9685.setPwm(0, 0, 500);
        sleep.msleep(1000);
        this.testPwmOnChannel0();
    }
}

let pca9685 = new PCA9685Test();