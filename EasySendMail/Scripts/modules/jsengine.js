exports.jsengine = {
    constructor: function() {
        return JsAbstractNoScriptObject.getComponentEngine();
    },
    addObject: function (obj) {
        return this.constructor().addObject(obj);
    },
    execute: function (sScriptCode) {
        return this.constructor().execute(sScriptCode);
    },
    invokeMethod: function () {
        return this.constructor().invokeMethod(functionName, parameters);
    }
};
