var jssrv = require("./modules/jssrv.js").jssrv; 
var jsdb = require("./modules/jsdb.js").jsdb; 
var jscustomquery = require("./modules/jscustomquery.js").jscustomquery; 
var Enumerable = require('./modules/linq.js');
var jsdbstringconnectiion = require("./modules/jsdbstringconnectiion.js").jsdbstringconnectiion; 
var jsprvdbaccount = require("./modules/jsprvdbaccount.js").jsprvdbaccount; 

require("./modules/jsextstring.js").jsextstring();

exports.jsdbconnect = {

    RESULT_FORMAT : {
        ALL : 0,
        JSON_COLUMNS : 1,
        JSON_ROWS : 2
    },

    getConnectionString : function(idDbAccount) {
        var dbConnectionFormat = Enumerable.from(jsdbstringconnectiion.Records)
          .where(function(item) { return item.ID_LANGUAGE_PROGRAMMING == jssrv.getParameter('languageProgramming'); })
          .select(function(item) { return item.DB_CONNECTION_FORMAT; })
          .toArray();

        var dbAccount = Enumerable.from(jsprvdbaccount.Records)
          .where(function(item){ return item.ID_DB_ACCOUNT == idDbAccount; })
          .toArray();
    
        var result = String.formatByJson(dbConnectionFormat[0],
          {
            "@IP_SERVER": dbAccount[0].IP_SERVER,
            "@DATABASE": dbAccount[0].DATABASE,
            "@LOGIN": dbAccount[0].LOGIN,
            "@PASSWORD": dbAccount[0].PASSWORD
          }
        );
    
        return result;
    },

    isValidCharacter : function(value) {
        //var letters = /^[0-9a-zA-Z_]+$/;
        return value.match(/^[0-9a-zA-Z_]+$/);
    },
    
    executeSql : function(query, jsonParams, resultFormat) {
        var FN_SINGLE_QUOTE = "'";
        var FN_DOUBLE_QUOTE = '"';
        var FN_AT = "@";
        var FN_QUESTION_MARK = "?";
    
        var parsedQuery = "";
    
        var array = new Array();
    			
        var length = query.length;
        var inSingleQuote = false;
        var inDoubleQuote = false;
    
        for(var i = 0; i < length; i++) {
            var c = query.charAt(i);
            if(inSingleQuote) {
                if(c === FN_SINGLE_QUOTE) {
                    inSingleQuote = false;
                }
            }
            else if(inDoubleQuote) {
                if(c === FN_DOUBLE_QUOTE) {
                    inDoubleQuote = false;
                }
            }
            else {
                if(c === FN_SINGLE_QUOTE) {
                    inSingleQuote = true;
                }
                else if(c === FN_DOUBLE_QUOTE) {
                    inDoubleQuote = true;
                }
                //else if(c == ':'
                else if(c === FN_AT
                        &&
                        i + 1 < length
                        &&
                        this.isValidCharacter(query.charAt(i + 1))
                ) {
                    var j = i + 2;
                    while (j < length && this.isValidCharacter(query.charAt(j))) {
                        j++;
                    }
                    //Generazione dell'Array contenente i parametri per i ? della query 
                    //var name = query.substring(i + 1, j);
                    var key = query.substring(i, j);
                    //replace the parameter with a question mark
                    c = FN_QUESTION_MARK;
                    //skip past the end if the parameter
                    i += key.length;
                    c += query.charAt(i);
                    array.push(jsonParams[key]);
                }
            }
            parsedQuery += c;
        }
    
        var connectionString = this.getConnectionString("Filemaker.DbInterventi");
        
        var connection = jsdb.getInstance();
    
        connection.open(connectionString);
    
        connection.prepareStatement(parsedQuery);
    
        for (var i = 0; i < array.length; i++) {
            connection.bindParameter(i, array[i]);
        }
    
        if (parsedQuery.substring(0, 6) == "SELECT") {
          connection.executeQuery();
    
          var columnCount = connection.columnCount(); 
    
          var jsonColumns = [];
        
          for (var i = 0; i < columnCount; i++) {
            var field = {
              columnName : "" + connection.columnName(i),
              columnType : "" + connection.columnType(i)
            };
    
            jsonColumns[jsonColumns.length] = field;
          }
    
          var jsonRows = [];
    
          while (connection.moveNext()) {
            var jsonRow = {};
            
            for (var i = 0; i < columnCount; i++) {
              var item = connection.columnValue(i);
              //if (fields[i].Type == 133) {
                //item = new Date(Date.parse(item));
              //}
              jsonRow[jsonColumns[i].columnName] = "" + item;
            }
    
            jsonRows[jsonRows.length] = jsonRow;
          }
         
          connection.close();
        }
        else {
          var rowCount = connection.executeNonQuery();
    
          connection.close();
        
          var result = {
              rowCount: rowCount
          };
          return result;
        }      
    
        var result = {};
    
        switch(resultFormat) {
            case this.RESULT_FORMAT.ALL:
                result.jsonColumns = jsonColumns;
                result.jsonRows = jsonRows;
                break;
            case this.RESULT_FORMAT.JSON_COLUMNS:
                result = jsonColumns;
                break;
            case this.RESULT_FORMAT.JSON_ROWS:
            default:
                result = jsonRows;
                break;
        }
        return result;
    },

    fromNull2Empty : function(value) {
        return (value == null || value == "null" ? "" : value);
    },

    makerSql : function(idQuery) {
        var languageProgramming = "" + jssrv.getParameter('languageProgramming');
        var queryTable = jscustomquery.makerSql(languageProgramming);
   
        return queryTable[idQuery];
    },

    makeAndExecuteSql : function(idQuery, jsonParams, resultFormat) {
        return this.executeSql(this.makerSql(idQuery), jsonParams, resultFormat);
    }
};
