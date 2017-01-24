exports.jsextstring = function() {
    String.prototype.format = function (args) {
    	var str = this;
    	return str.replace(String.prototype.format.regex, function(item) {
    		var intVal = parseInt(item.substring(1, item.length - 1));
    		var replace;
    		if (intVal >= 0) {
    			replace = args[intVal];
    		}
    		else if (intVal === -1) {
    			replace = "{";
    		}
    		else if (intVal === -2) {
    			replace = "}";
    		}
    		else {
    			replace = "";
    		}
    		return replace;
    	});
    };
    
    String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");
    
    /*
    // Sample usage.
    var str = "She {1} {0}{2} by the {0}{3}. {-1}^_^{-2}";
    str = str.format(["sea", "sells", "shells", "shore"]);
    alert(str);
    */
    
    String.stringFormat = function(string) {
    	var params = [];
    	for(var i = 1; i < arguments.length; i++) {
    		params.push(arguments[i]);
    	}
    	return string.format(params);
    };
    
    String.stringFormat2 = function(string, params) {
    	return string.format(params);
    };
    
    String.formatByJson = function(string, jsonParams) {
        var array = new Array();
    
        var parsedString = string;
    
        var i = 0;
        for (var key in jsonParams) {
            var keyCurlied = "{" + key + "}";  
            if (parsedString.indexOf(keyCurlied) >= 0) {
                var replace = "{" + i + "}"; 
                parsedString = parsedString.replace(new RegExp(keyCurlied, 'g'), replace);
                i++;
                array.push(jsonParams[key]);
            }
        }
        
        return String.stringFormat2(parsedString, array);
    };
};
