const fs = require('node-fs');
const path = require('path');

class Config {

    constructor() {

        this.path = {
            root : path.dirname(require.main.filename)
        };

        this.path.public = this.path.root + '/public';
        this.path.app = this.path.root + '/app';

        let config = JSON.parse(fs.readFileSync(this.path.app + '/config/config.json', 'utf8'));

        for(let entry in config) {
            this[entry] = config[entry];
        }

        console.log(this);

    }
}

module.exports = new Config();