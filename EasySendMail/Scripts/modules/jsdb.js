exports.jsdb = {
    constructor: function() {
        return JsAbstractNoScriptObject.getComponentConnection();
    },
    getInstance: function () {
        return this.constructor().getInstance();
    },
    open: function(connectionString) {
        return this.constructor().open(connectionString);
    },
    close: function() {
        return this.constructor().close();
    },
    bindParameter: function(i, object) {
        return this.constructor().bindParameter(i, object);
    },
    prepareStatement: function(sql) {
        return this.constructor().prepareStatement(sql);
    },
    executeQuery: function() {
        return this.constructor().executeQuery();
    },
    executeNonQuery: function() {
        return this.constructor().executeNonQuery();
    },
    isBof: function () {
        return this.constructor().isBof();
    },
    isEof: function () {
        return this.constructor().isEof();
    },
    moveNext: function () {
        return this.constructor().moveNext();
    },
    columnCount: function () {
        return this.constructor().columnCount();
    },
    columnName: function (i) {
        return this.constructor().columnName(i);
    },
    columnType: function (i) {
        return this.constructor().columnType(i);
    },
    columnValue: function (i) {
        return this.constructor().columnValue(i);
    }
};
