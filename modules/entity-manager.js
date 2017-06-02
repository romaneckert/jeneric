const fs = require('fs');
const path = require('path');
const AbstractModule = require('../core/abstract-module');

/** class to save instances of type entity */
class EntityManager extends AbstractModule {

    constructor(directory) {

        super();

        this._data = {};
        this._directory = directory;
        this._path = this._directory + 'data.json';

        // create data json if not exists
        if(!fs.existsSync(this._path)) fs.writeFileSync(this._path, JSON.stringify(this._data));

        // read data from json
        let rawData = JSON.parse(fs.readFileSync(this._path), (key, value) => {
            let a;
            // convert date string to date object
            if (typeof value === 'string') {
                a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);

                if (a) {
                    return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
                }
            }
            return value;
        });

        // set entity class to each object
        for(let entityName in rawData) {

            let entityData = rawData[entityName];

            for(let id in entityData) {
                let entityClass = require(path.join(__dirname, '/../entity/' + entityName + '.js'));

                rawData[entityName][id].__proto__ = entityClass.prototype;

                this.persist(rawData[entityName][id]);
            }
        }
    }

    persist(object) {

        let entityName = object.entityName;

        // check if table name already used in data
        if('undefined' === typeof this._data[entityName]) this._data[entityName] = {};

        // set id for object if not set
        if('number' !== typeof object.id) object.id = this.getNewId(object);

        this._data[entityName][object.id] = object;

    }

    remove(object) {

    }

    // action to save current data
    flush() {

        fs.writeFileSync(this._path, JSON.stringify(this._data));

    }

    getNewId(object) {

        let increment = 0;

        for(let id in this._data[object.entityName]) {
            if(parseInt(id) > increment) increment = parseInt(id);
        }

        return increment + 1;
    }

}

module.exports = EntityManager;