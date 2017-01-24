exports.jsfs = {
    constructor: function() {
        return JsAbstractNoScriptObject.getComponentFile();
    },
    getTxtFromFile: function (path) {
        return this.constructor().getTxtFromFile(path);
    },
    writeFileFromTxt: function (path, value) {
        return this.constructor().writeFileFromTxt(path, value);
    },
    getTxtFromFileByUrl: function (url) {
        return this.constructor().getTxtFromFileByUrl(url);
    },
    fileRename: function (pathSource, pathDest) {
        return this.constructor().fileRename(pathSource, pathDest);
    },
    fileDelete: function (path) {
        return this.constructor().fileDelete(path);
    },
    fileExist: function (path) {
        return this.constructor().fileExist(path);
    },
    directoryExist: function (folderSource) {
        return this.constructor().directoryExist(folderSource);
    },
    copyDirectory: function (folderSource, folderDest) {
        return this.constructor().copyDirectory(folderSource, folderDest);
    }
};
