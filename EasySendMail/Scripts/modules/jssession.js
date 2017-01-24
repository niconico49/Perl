exports.jssession = {
    constructor: function() {
        return JsAbstractNoScriptObject.getComponentSession();
    },
    getAttribute: function (key) {
        return this.constructor().getAttribute(key);
    },
    setAttribute: function (key, value) {
        return this.constructor().setAttribute(key, value);
    },
    removeAllAttribute: function () {
        return this.constructor().removeAllAttribute();
    }
};
