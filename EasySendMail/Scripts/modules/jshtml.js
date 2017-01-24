var jsfs = require("./modules/jsfs.js").jsfs; 
var Enumerable = require('./modules/linq.js');

require("./modules/jsextstring.js").jsextstring();

exports.jshtml = {

    xmlRegularExpression : [
        "<script(?:[^>]*src=['\"]([^'\"]*)['\"][^>]*>|[^>]*>([^<]*))" + "<" + "/script>",
        "<img(?:[^>]*src=['\"]([^'\"]*)['\"][^>]*>|[^>]*>([^<]*)/>)",
        "<link(?:[^>]*href=['\"]([^'\"]*)['\"][^>]*>|[^>]*>([^<]*)/>)"
    ],
    
    listAttachment : function(key, pathFull, listAttachment) {
      	var id = "id_" + listAttachment.length + "_";
      
        if (listAttachment.length == 0) {
            listAttachment[listAttachment.length] = {
                key : id,
                value: pathFull
            };
        }
        else {
          var rowPathFull = Enumerable.from(listAttachment)
            .where(function (item) { return item.value == pathFull })
            .toArray();
      
          if (rowPathFull.length == 0) {
            listAttachment[listAttachment.length] = {
                key : id,
                value: pathFull
            };
          }
          else {
            id = rowPathFull[0].key;
          } 
        }
      
        return id;
    },

    replaceScriptTag : function(xml) {
        var regExpPattern = "<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>";
        var regExpConfig = "gim";
      
        var re = new RegExp(regExpPattern, regExpConfig);
        var resultArray = re.exec(xml)
      
        while (resultArray != null) {
          var xmlTag = resultArray[0];
          xml = xml.replace(xmlTag, "");
          re = new RegExp(regExpPattern, regExpConfig);
          resultArray = re.exec(xml)
        }
        return xml;
    },

    plane : function(xml, pathInfo) {

    	var result = xml;
      var listAttachment = [];

    	var regExp = this.xmlRegularExpression;
    
      for (var i = 0; i < regExp.length; i++) {
    		var item = regExp[i];
    		var re = new RegExp(item, "g");
    		var resultArray = re.exec(xml);
    		if (re.lastIndex > 0) {
    			do {
    				var htmlTag = resultArray[0];
    				var key = resultArray[1];
    
            var pathFull = pathInfo + "/" + key;
    
    				if (item.indexOf("<script") === 0) {
    					//Retrieve src by pathinfo + key as txt
    					var scriptContent = "" + jsfs.getTxtFromFile(pathFull) + "";
      				var src = String.formatByJson('src="{@SRC}"',
      					{
                  "@SRC": key
                }
      				);
    					
    					var tagComputed = htmlTag.replace(src, "").replace("<" + "/script>",  scriptContent + "<" + "/script>");
    					result = result.replace(htmlTag, tagComputed);
    				}
    				if (item.indexOf("<img") === 0) {
              var id = this.listAttachment(key, pathFull, listAttachment);
              var value = String.formatByJson('src="{@SRC}"',
      					{
                  "@SRC": key
                }
      				);
      				var cid = String.formatByJson('cid:{@CID}',
      					{
                  "@CID": id
                }
      				);
      				var attributeComputed = String.formatByJson('src="{@SRC}"',
      					{
                  "@SRC": cid
                }
      				);
            	var tagComputed = htmlTag.replace(value, attributeComputed);
    					result = result.replace(htmlTag, tagComputed);
    				}

    				if (item.indexOf("<link") === 0) {
    					var cssContent = "" + jsfs.getTxtFromFile(pathFull) + "";
      				var href = String.formatByJson('href="{@HREF}"',
      					{
                  "@HREF": key
                }
      				);
    					
    					//var relStyleSheet = 'rel="stylesheet"';
    					//.replace(relStyleSheet, "")
    					//cssContent = cssContent.replace(/^\s*[\r\n]/gm, "")
              //var tagComputed = htmlTag; 
    					//tagComputed = tagComputed.replace(href, "");
    /*					
    					var tagComputed = htmlTag.replace(href, "");
              tagComputed = tagComputed.replace("<link", "<style");
              tagComputed = tagComputed.replace('rel="stylesheet"', "");
              tagComputed = tagComputed.replace("  ", " ");
              tagComputed = tagComputed.replace('type="text/css"', "");
              tagComputed = tagComputed.replace("  ", " ");
              tagComputed = tagComputed.replace("/>", ">\r\n" +  cssContent + "</style>");
    */
              var tagComputed = "<style>\n\r" + cssContent + "</style>\n\r"; 
    					result = result.replace(htmlTag, tagComputed);
    				}
    
    				var resultArray = re.exec(xml);
    			}
    			while(re.lastIndex > 0)
    		}
    	}      
    	return {
          xml: result,
          listAttachment: listAttachment
      };
    }
};
