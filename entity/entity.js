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
}

module.exports = Entity;