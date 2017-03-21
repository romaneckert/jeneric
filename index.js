module.exports = {
    Entity : {
        Entity : require('./entity/entity')
    },
    Core : {
        EntityManager: require('./core/entity-manager'),
        Config: require('./core/config'),
        Jeneric: require('./core/jeneric')
    },
    Controller : {
        Controller : require('./controller/controller')
    },
    Util : {
        Speaker : require('./util/speaker')
    }
};