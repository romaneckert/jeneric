const fs = require('node-fs');
const path = require('path');

class Config {

    constructor() {

        this.config = {
            file : 'config/config.json'
        };

        this.path = {
            root : path.dirname(require.main.filename) + '/'
        };

        this.path.public = this.path.root + 'public/';
        this.path.app = this.path.root + 'app/';

        if(fs.existsSync(this.path.app + this.config.file)) {
            let jsonConfig = JSON.parse(fs.readFileSync(this.path.app + this.config.file, 'utf8'));

            for(let entry in jsonConfig) {
                this[entry] = jsonConfig[entry];
            }
        }

        console.log(this);

    }
}

module.exports = new Config();