exports.jsmail = {
    constructor: function() {
        return JsAbstractNoScriptObject.getComponentMail();
    },
    getInstance: function () {
        return this.constructor().getInstance();
    },
    setHost: function (value) {
        return this.constructor().setHost(value);
    },
    setPort: function (value) {
        return this.constructor().setPort(value);
    },
    setLogin: function (value) {
        return this.constructor().setLogin(value);
    },
    setPassword: function (value) {
        return this.constructor().setPassword(value);
    },
    setMailFrom: function (value) {
        return this.constructor().setMailFrom(value);
    },
    setMailTo: function (value) {
        return this.constructor().setMailTo(value);
    },
    setMailCc: function (value) {
        return this.constructor().setMailCc(value);
    },
    setMailBcc: function (value) {
        return this.constructor().setMailBcc(value);
    },
    setSubject: function (value) {
        return this.constructor().setSubject(value);
    },
    setBody: function (value) {
        return this.constructor().setBody(value);
    },
    prepare: function () {
        return this.constructor().prepare();
    },
    addContentId: function (key, value) {
        return this.constructor().addContentId(key, value);
    },
    send: function () {
        return this.constructor().send();
    }
};
