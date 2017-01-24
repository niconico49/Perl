/*
When resolving module names to file paths, use the following rules...

    if the module does not begin with './' or '/' then ...

    1.1 Look in any of the supplied library paths. If it's not there then throw an error.

    If the module begins with './' or '/' then ...

    2.1 if the module begins with './' then it's treated as a file path. File paths are always relative to the module from which the require() call is being made.

    2.2 If the module begins with '/' then it's treated as an absolute path.

    If the module does not have a '.js' suffix, and a file with the same name and a .js sufix exists, then the file will be loaded.

    If the module name resolves to a directory then...

    3.1 look for a package.json file in the directory and load the main property e.g.

    // package.json located in './some-library/'
    {
      "main": './some-lib.js',
      "name": 'some-library'
    }

    3.2 if no package.json file exists then look for an index.js file in the directory
*/
/*
if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, 'endsWith', {
    value: function(searchString, position) {
      var subjectString = this.toString();
      if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }
  });
}
*/
(function (rootDir, modulePaths, hooks) {

  function ComponentRequire() { }
  
  ComponentRequire.fileExist = function(path) {
    return JsComponentFile.fileExist(path);
    //return JsAbstractNoScriptObject.getComponentFile().fileExist(path);
  };

  ComponentRequire.getTxtFromFile = function(path) {
    return JsComponentFile.getTxtFromFile(path);
    //return JsAbstractNoScriptObject.getComponentFile().getTxtFromFile(path);
  };

  ComponentRequire.directoryExist = function(path) {
    return JsComponentFile.directoryExist(path);
    //return JsAbstractNoScriptObject.getComponentFile().directoryExist(path);
  };

  ComponentRequire.endsWith = function (source, suffix) {
    return source.indexOf(suffix, source.length - suffix.length) !== -1;
  };

  ComponentRequire.getParentDirPath = function (path) {
    var flagSlash = ComponentRequire.endsWith(path, "/");
    return path.substring(0, path.lastIndexOf("/", flagSlash ? path.length - 2 : path.length - 1) + 1);
  };

  var resolveModuleToFile = function (path) {

    if (JsComponentFile.fileExist(path)) {
      return JsComponentFile.getTxtFromFile(path);
    }

    // it's a module named like so ... 'events' , 'net/http'
    var arrayPostfix = [
      "",
      ".js"
    ];

    for (var i = 0; i < modulePaths.length; i++) {
      var itemPath = modulePaths[i] + path;
      for (var j = 0; j < arrayPostfix.length; j++) {
        var itemFullPath = arrayPostfix[j] + itemPath;

        if (ComponentRequire.fileExist(itemFullPath)) {
            return ComponentRequire.getTxtFromFile(itemFullPath);
        }
        else if (ComponentRequire.directoryExist(itemFullPath)) {
            // look for a package.json file
            var arrayPackage = [
              "./package.json",
              "./index.js"
            ];
            
            for (var k = 0; arrayPackage.length; k++) {
              var item = itemFullPath + arrayPackage[k];
              if (fileExist(item)) {
                return ComponentRequire.getTxtFromFile(item);
                break;
              }
            }
        } 
/*
        switch(true) {
          case ComponentRequire.fileExist(itemFullPath) > 0:
            return ComponentRequire.getTxtFromFile(itemFullPath);
            break;
          case ComponentRequire.directoryExist(itemFullPath) > 0:
            // look for a package.json file
            var arrayPackage = [
              "./package.json",
              "./index.js"
            ];
            
            for (var k = 0; arrayPackage.length; k++) {
              var item = itemFullPath + arrayPackage[k];
              if (fileExist(item)) {
                return ComponentRequire.getTxtFromFile(item);
                break;
              }
            }
            //var packageJsonPath = dir + "./package.json";
            //var indexJsPath = dir + "./index.js";
            //result = ComponentRequire.fileExist(packageJsonPath) ? ComponentRequire.getTxtFromFile(packageJsonPath) : ComponentRequire.getTxtFromFile(indexJsPath);
            break;
        }
*/        
      }
    }

    return null;
  };

  var _loadedModules = {};
  /*
   require() function implementation
   */
  var _require = function(parentFile, path) {
  
    var scriptCode = resolveModuleToFile(path, parentFile);

    if (scriptCode == "") {
      var errMsg = "require() failed to find matching file/directory for module: " + path;
      if (!("" + path).match("^\.")) {
        errMsg += " and not found in paths " + JSON.stringify(modulePaths);
      }
      throw errMsg;
    }
   
    var canonizedPath = path.replace(new RegExp("\\\\", "g"), "/");
    
    var moduleInfo = _loadedModules[canonizedPath];

    if (moduleInfo) {
      return moduleInfo;
    }

    if (hooks) {
      hooks.loading(canonizedPath);
    }

    moduleInfo = {
      loaded: false,
      id: canonizedPath,
      exports: {},
      require: _requireClosure(ComponentRequire.getParentDirPath(path))
    };

    scriptCode = "(function(exports, module, require, __filename, __dirname) { " + scriptCode + "})";

    _loadedModules[canonizedPath] = moduleInfo;
    
    var compiledWrapper = null;
    try {
      compiledWrapper = eval(scriptCode);
    }
    catch (e) {
      throw new Error("Error evaluating module " + path + " line #" + e.lineNumber + " : " + e.message, canonizedPath, e.lineNumber);
    }
    var __dirname = "" + path //sarebbe la directory del file ??;

    var parameters = [
      moduleInfo.exports, // exports
      moduleInfo,         // module
      moduleInfo.require, // require
      canonizedPath,  // __filename
      __dirname           // __dirname
    ];

    try {
      // this
      compiledWrapper.apply(moduleInfo.exports, parameters);   
    }
    catch (e) {
      throw new Error("Error executing module " + path + " line #" + e.lineNumber + " : " + e.message, canonizedPath, e.lineNumber);
    }
    if (hooks) { 
      hooks.loaded(canonizedPath);
    }
    moduleInfo.loaded = true;
    return moduleInfo;
  };

  var _requireClosure = function(parent) {
    return function(path) {
      var module = _require(parent, path);
      return module.exports;
    };
  };
  return _requireClosure(rootDir);
  // last line deliberately has no semicolon!
})
