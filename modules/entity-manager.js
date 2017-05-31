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

        if(!fs.existsSync(this._path)) {
            fs.writeFileSync(this._path, JSON.stringify(this._data));
        }

        this._data = JSON.parse(fs.readFileSync(this._path));

        for(let tableName in this._data) {
            let tableData = this._data[tableName];

            for(let id in tableData) {
                let rawObject = this._data[tableName][id];
                let entityClass = require(path.join(__dirname, '/../entity/' + tableName.slice(0, -1) + '.js'));
                let object = eval("Object.create(entityClass, rawObject)");

                console.log(object);

            }
        }
    }

    persist(object) {

        let tableName = object.tableName;

        // check if table name already used in data
        if('undefined' === typeof this._data[tableName]) this._data[tableName] = {};

        // set id for object if not set
        if('number' !== typeof object.id) object.id = this.getNewId(object);

        this._data[tableName][object.id] = object;

    }

    remove(object) {

    }

    // action to save current data
    flush() {

        fs.writeFileSync(this._path, JSON.stringify(this._data), (error) => {
            if (error) throw Error;
        });

    }

    getNewId(object) {

        let increment = 0;

        for(let id in this._data[object.tableName]) {
            if(parseInt(id) > increment) increment = parseInt(id);
        }

        return increment + 1;
    }

}

module.exports = EntityManager;