/** all entities have to extend the entity class */
class Entity {
    constructor() {
        this._id = null;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    _getTableName() {
        return this.constructor.name.toLowerCase() + 's';
    }
}

module.exports = Entity;