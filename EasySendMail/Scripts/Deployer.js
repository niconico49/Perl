/*
//https://github.com/walterhiggins/commonjs-modules-javax-script/blob/master/README.md
//On JDK 8's Javascript Engine (Nashorn) there is a native load() function which can be used...
var Require = load("./require.js");
var require = Require("./", ["libpath1", "libpath2"]);
// now you can use require to load commonjs/node style modules
var myModule = require("./mymodule");
*/

window = typeof window === "undefined" ? {} : window;

var JsAbstractNoScriptObject = "";

function Load() {};
                 
Load.initialize = function(languageProgramming) {
  var languageFormatted = languageProgramming === "PHP" ? "PHP.": "";

  var result = "JsAbstractNoScriptObject = " + languageFormatted + "AbstractNoScriptObject;";
  eval(result);
};

Load.starter = function(path, languageProgramming) {
  Load.initialize(languageProgramming);
/*
  var JsComponentServer = {
      constructor: function() {
          return JsAbstractNoScriptObject.getComponentServer();
      },
      getDictionary: function () {
          return JsComponentServer.constructor().getDictionary();
      },
      addParameter: function (key, value) {
          return JsComponentServer.constructor().addParameter(key, value);
      },
      getParameter: function (value) {
          return JsComponentServer.constructor().getParameter(value);
      },
      removeParameter: function (value) {
          return JsComponentServer.constructor().removeParameter(value);
      },
      clearParameter: function () {
          return JsComponentServer.constructor().clearParameter();
      }
  };
*/

  var JsComponentFile = {
      constructor: function() {
          return JsAbstractNoScriptObject.getComponentFile();
      },
      getTxtFromFile: function (path) {
          return JsComponentFile.constructor().getTxtFromFile(path);
      },
      getTxtFromFileByUrl: function (url) {
          return JsComponentFile.constructor().getTxtFromFileByUrl(url);
      },
      fileExist: function (path) {
          return JsComponentFile.constructor().fileExist(path);
      },
      directoryExist: function (folderSource) {
          return JsComponentFile.constructor().directoryExist(folderSource);
      },
      copyDirectory: function (folderSource, folderDest) {
          return JsComponentFile.constructor().copyDirectory(folderSource, folderDest);
      }
  };


  var JsComponentDevelopment = {
      constructor: function() {
          return JsAbstractNoScriptObject.getComponentDevelopment();
      },
      displayValue: function (value) {
          return JsComponentDevelopment.constructor().displayValue(value);
      }
  };
  return eval("(" + JsComponentFile.getTxtFromFile(path) + ")");
  //return eval("(" + JsAbstractNoScriptObject.getComponentFile().getTxtFromFile(path) + ")");
}

function starter(languageProgramming) {
  var path = "./Scripts/require.js";
  
	Load.starter(path, languageProgramming);

  //..then bootstrap require like this...
  var Require = Load.load("./Scripts/require.js", languageProgramming);
  //var require = Require("./", ["libpath1", "libpath2" ]);
  var require = Require("./", ["./Scripts"]);

  var jssrvsendmail = require("./modules/jssrvsendmail.js").jssrvsendmail;
  jssrvsendmail.sendMail();
  
  return "function execute() {return 'execute';}";
   
/*  
  // now you can use require to load commonjs/node style modules
  var math = require("./math.js").math; 
  //var myModule = require("./math.js");
  //var result = myModule.add(3, 5);
  var jsdev = require("./modules/jsdev.js").jsdev; 
  jsdev.displayValue("jsdev");
  jsdev.displayValue("path: " + path);
  var jssrv = require("./modules/jssrv.js").jssrv;
  serverPathInfo = jssrv.getParameter("serverPathInfo"); 
  jsdev.displayValue("serverPathInfo: " + serverPathInfo);
  var jsfs = require("./modules/jsfs.js").jsfs; 
  var res = jsfs.getTxtFromFile(serverPathInfo + "/sendMail.html");
  jsdev.displayValue("res: " + res);

  require("./modules/jsextstring.js").jsextstring();
  
  var test = String.formatByJson("{@nick} and {@test}",
    {
      "@nick": '1',
      "@test": '2',
    }
  ); 
  jsdev.displayValue("test: " + test);

  //return myModule;
  //jsfs.displayValue(res);
  
  var result = math.add(3, 5);
  return "" + result;
*/
}

Load.load = function(path, languageProgramming) {
//var load = function(path, languageProgramming) {
	return Load.starter(path, languageProgramming);
  //return eval("(" + JsComponentFile.getTxtFromFile(path) + ")");
}

var exports = {};
/*
//..then bootstrap require like this...
var Require = Load.load("./require.js");
//var require = Require("./", ["libpath1", "libpath2" ]);
var require = Require("./");

// now you can use require to load commonjs/node style modules
var myModule = require("./math.js");

var result = myModule.add(3, 5);
*/