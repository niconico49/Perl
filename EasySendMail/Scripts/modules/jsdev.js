exports.jsdev = {
    constructor: function() {
        return JsAbstractNoScriptObject.getComponentDevelopment();
    },
    displayValue: function(value) {
        return this.constructor().displayValue(value);
    }
/*
    displayValue: function(value) {
      return JsAbstractNoScriptObject.getComponentDevelopment().displayValue(value);
    }
*/  
};
