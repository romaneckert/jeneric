/** all entities have to extend the entity class */
class AbstractEntity {
    constructor() {
        this._id = null;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get tableName() {
        return this.constructor.name.toLowerCase() + 's';
    }
}

module.exports = AbstractEntity;