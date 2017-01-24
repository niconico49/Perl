exports.jssrv = {
    constructor: function() {
        return JsAbstractNoScriptObject.getComponentServer();
    },
    getDictionary: function () {
        return this.constructor().getDictionary();
    },
    execCmd: function (cmd, args) {
        return this.constructor().execCmd(cmd, args);
    },
    addParameter: function (key, value) {
        return this.constructor().addParameter(key, value);
    },
    getParameter: function (value) {
        return this.constructor().getParameter(value);
    },
    removeParameter: function (value) {
        return this.constructor().removeParameter(value);
    },
    clearParameter: function () {
        return this.constructor().clearParameter();
    }
};
