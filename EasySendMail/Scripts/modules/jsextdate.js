exports.jsextdate = function() { 
    if (!Date.prototype.toISOString ) {
      (function() {
        function pad(number) {
          var r = String(number);
          if (r.length === 1) {
            r = '0' + r;
          }
          return r;
        }
    /*
        Date.prototype.toISOString = function() {
          return this.getUTCFullYear()
            + '-' + pad(this.getUTCMonth() + 1)
            + '-' + pad(this.getUTCDate())
            + 'T' + pad(this.getUTCHours())
            + ':' + pad(this.getUTCMinutes())
            + ':' + pad(this.getUTCSeconds())
            + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
            + 'Z';
        };
    */
        Date.prototype.toISOString = function() {
          return this.getUTCFullYear()
            + '-' + pad(this.getMonth() + 1)
            + '-' + pad(this.getDate())
            + 'T' + pad(this.getHours())
            + ':' + pad(this.getMinutes())
            + ':' + pad(this.getSeconds())
            + '.' + String((this.getMilliseconds() / 1000).toFixed(3)).slice(2, 5)
            + 'Z';
        };
      }());
    }
    
    Date.FN_DIFF_DATE_TYPE = {
        DAYS: 1,
        WEEKS: 2,
        MONTHS: 3,
        YEARS: 4
    };
    
    Date.FN_CONSTS = {
        FN_DAY_MILLESECONDS: 24 * 3600 * 1000,
        FN_WEEK_MILLESECONDS: 24 * 3600 * 1000 * 7
    };
    
    Date.prototype.FN_DIFF_DATE_TYPE = Date.FN_DIFF_DATE_TYPE;
    Date.prototype.FN_CONSTS = Date.FN_CONSTS;
    
    Date.prototype.diffDate = function (dateStart, dateEnd, type) {
        var result = 0;
    
        switch (type) {
            case Date.FN_DIFF_DATE_TYPE.DAYS:
                var timeStart = dateStart.getTime();
                var timeEnd = dateEnd.getTime();
                result = parseInt((timeEnd - timeStart) / Date.FN_CONSTS.FN_DAY_MILLESECONDS);
                break;
            case Date.FN_DIFF_DATE_TYPE.WEEKS:
                var timeStart = dateStart.getTime();
                var timeEnd = dateEnd.getTime();
                result = parseInt((timeEnd - timeStart) / Date.FN_CONSTS.FN_WEEK_MILLESECONDS);
                break;
            case Date.FN_DIFF_DATE_TYPE.MONTHS:
                var yearStart = dateStart.getFullYear();
                var yearEnd = dateEnd.getFullYear();
                var monthStart = dateStart.getMonth();
                var monthEnd = dateEnd.getMonth();
                result = (monthEnd - monthStart) + 12 * (yearEnd - yearStart);
                break;
            case Date.FN_DIFF_DATE_TYPE.YEARS:
                var yearStart = dateStart.getFullYear();
                var yearEnd = dateEnd.getFullYear();
                result = yearEnd - yearStart;
                break;
        }
        return result;
    };
    
    Date.FN_HOLYDAYS = [
        [1, 1]
      , [1, 6]
      , [4, 25]
      , [5, 1]
      , [6, 2]
      , [8, 15]
      , [11, 1]
      , [12, 8]
      , [12, 25]
      , [12, 26]
    ];
    
    Date.prototype.FN_HOLYDAYS = Date.FN_HOLYDAYS;
    
    Date.prototype.addDays = function(d) {
    	this.setDate(this.getDate() + d);
    };
    
    Date.prototype.addMonths = function(m) {
    	var d = this.getDate();
    	this.setMonth(this.getMonth() + m);
    
    	if (this.getDate() < d) {
    		this.setDate(0);
    	}
    };
    
    Date.prototype.addYears = function(y) {
    	var m = this.getMonth();
    	this.setFullYear(this.getFullYear() + y);
    
    	if (m < this.getMonth()) {
    		this.setDate(0);
    	}
    };
    
    Date.prototype.isWeekEndDay = function() {
    	var dayOfWeek = this.getDay();
    	//0 = Sunday 
    	//6 = Saturday 
    	return dayOfWeek == 0
    		   ||
    		   dayOfWeek == 6;
    };
    
    Date.prototype.easterDate = function() {
    	var year = this.getFullYear();
    	var d = (((255 - 11 * (year % 19)) - 21) % 30) + 21;
    	var result = new Date(year, 2, 1);
    	var d48 = d > 48 ? -1 : 0; 
    	var offset = d + d48 + 6 - ((year + (year / 4 >> 0) + d + d48 + 1) % 7); 
    	result.addDays(offset);
    	return result;
    };
    
    Date.prototype.isHolydayDate = function() {
    	for (var i = 0; i < this.FN_HOLYDAYS.length; i++) {
    		if (this.getMonth() == this.FN_HOLYDAYS[i][0] - 1
    			&&
    			this.getDate() == this.FN_HOLYDAYS[i][1]
    		) {
    			return true;
    		}
    	}
    
    	var easterDateMonday = this.easterDate();
    	easterDateMonday.addDays(1);
    
    	if (this.getMonth() == easterDateMonday.getMonth()
    		&&
    		this.getDate() == easterDateMonday.getDate()
    	) {
    		return true;
    	}
    
    	return false;
    };
    
    Date.prototype.isRestingDate = function() {
    	return this.isWeekEndDay()
    		   ||
    		   this.isHolydayDate();
    };
    
    Date.prototype.isWorkingDate = function() {
    	return !this.isRestingDate();
    };
    
    Date.prototype.addWorkingDay = function(workingDay) {
    	if (workingDay != 0) {
    		var sign = workingDay >= 0 ? 1 : -1;
    		var limit = Math.abs(workingDay);
    		//N.B: se la data di partenza e' un festivo ==> si porta al primo feriale disponibile
    		//si cicla spostandosi x tanti giorni festivi passati da parametro
    		for (var i = 0; i < limit; i++) {
    			while (this.isRestingDate()) {
    				//result = result.AddDays(sign)
    				this.addDays(sign);
    			}
    			this.addDays(sign);
    			while (this.isRestingDate()) {
    				//result = result.AddDays(sign)
    				this.addDays(sign);
    			}
    		}
    	}
    };
    
    Date.prototype.deltaWorkingDay = function (dateStart, dateEnd) {
        var result = 0;
        var limit = this.diffDate(dateStart, dateEnd, Date.FN_DIFF_DATE_TYPE.DAYS);
        if (limit <= 0) {
            return result;
        }
        var date = dateStart;
        //Si cicla giorno x giorno controllando se si cade in un feriale o festivo
        for (i = 1; i <= limit; i++) {
            date.addDays(i);
            if (!date.isRestingDate()) {
                result += 1;
            }
        }
        return result;
    };
    
    Date.prototype.formatDate = function (format) {
        var date = this;
        //function formatDate(date, format) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
    
        if (!format) {
            //format = "MM/dd/yyyy";
            format = "dd/MM/yyyy";
        }
    
        format = format.replace("MM", month.toString().replace(/^(\d)$/, '0$1'));
    
        if (format.indexOf("yyyy") > -1) {
            format = format.replace("yyyy", year.toString());
        } else if (format.indexOf("yy") > -1) {
            format = format.replace("yy", year.toString().substr(2, 2));
        }
    
        format = format.replace("dd", day.toString().replace(/^(\d)$/, '0$1'));
    
        if (format.indexOf("t") > -1) {
            if (hours > 11) {
                format = format.replace("t", "pm");
            } else {
                format = format.replace("t", "am");
            }
        }
    
        if (format.indexOf("HH") > -1) {
            format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
        }
    
        if (format.indexOf("hh") > -1) {
            if (hours > 12) {
                hours -= 12;
            }
    
            if (hours === 0) {
                hours = 12;
            }
            format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
        }
    
        if (format.indexOf("mm") > -1) {
            format = format.replace("mm", minutes.toString().replace(/^(\d)$/, '0$1'));
        }
    
        if (format.indexOf("ss") > -1) {
            format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
        }
    
        return format;
    };
    
    Date.prototype.dateFromISO8601 = function (stringISO) {
        var item = stringISO.match(/\d+/g);
        var date = this;
        date.setFullYear(item[0]);
        date.setMonth(item[1] - 1);
        date.setDate(item[2]);
        if (item.length > 3) {
            date.setHours(item[3]);
            date.setMinutes(item[4]);
            date.setSeconds(item[5]);
        }
    };
    
    
    Date.isWorkingDate = function(dateTick) {
      var num = parseInt(dateTick, 10);
      var date = new Date(num);
      return date.isWorkingDate();
    };
    
    //var dateLongWithoutTimeZoneOffset = date.getTime() - 1000 * 60 * date.getTimezoneOffset();
    //return dateLongWithoutTimeZoneOffset;
    Date.addWorkingDay = function(dateTick, workingDay) {
      var num = parseInt(dateTick, 10);
      var date = new Date(num);
      date.addWorkingDay(workingDay);
      return date.getTime();
    };
    
    Date.addWorkingDayExtreme = function(data, workingDay) {
    	var dateLongWithoutTimeZoneOffset = data.getTime() - 1000 * 60 * data.getTimezoneOffset();
    	var tick = Date.addWorkingDay(dateLongWithoutTimeZoneOffset, workingDay);
    	return new Date(tick);
    };
    
    Date.deltaWorkingDay = function(dateStart, dateEnd) {
        var date = new Date();
        return date.deltaWorkingDay(dateStart, dateEnd);
    };
    
    Date.dateFromISO8601 = function(stringISO) {
    //JsShell.Echo("stringISO ==> " + stringISO);
    
      var item = stringISO.match(/\d+/g);
      var date = null;
    
      if (item.length > 3) {
          date = new Date(item[0], item[1] - 1, item[2], item[3], item[4], item[5]);
      }
      else {
          date = new Date(item[0], item[1] - 1, item[2], 0, 0, 0);
      }
    
      //date = new Date(stringISO);
    
    //JsShell.Echo("date ==> " + date);
      return date;
    };
    
    Date.isNullOrEmpty = function(value) {
      return value == null || value == "";
    }; 
    
    Date.isNullOrEmptyWithDefault = function(value, defaultValue) {
      return Date.isNullOrEmpty(value) ? defaultValue : value;
    }; 
    
    Date.formatDateWithDefault = function(value, defaultValue, format) {
      var date = Date.isNullOrEmptyWithDefault(value, defaultValue);
      if (date != "") {
        var data = Date.dateFromISO8601(date);
        date = data.formatDate(format);
      }
      return date;
    }; 
    
    //(function () {
    //  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
      
    //  var re = new RegExp(/%(a|A|b|B|c|C|d|D|e|F|h|H|I|j|k|l|L|m|M|n|p|P|r|R|s|S|t|T|u|U|v|V|W|w|x|X|y|Y|z)/g);
    //  var abbreviatedWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    //  var fullWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //  var abbreviatedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //  var fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
    //  function padNumber(num, count, padCharacter) {
    //    if (typeof padCharacter == "undefined") {
    //      padCharacter = "0";
    //    }
    //    var lenDiff = count - String(num).length;
    //    var padding = "";
      
    //    if (lenDiff > 0)
    //      while (lenDiff--)
    //        padding += padCharacter;
            
    //    return padding + num;
    //  }
      
    //  function dayOfYear(d) {
    //    var oneJan = new Date(d.getFullYear(), 0, 1);
    //    return Math.ceil((d - oneJan) / 86400000);
    //  }
      
    //  function weekOfYear(d) {
    //    var oneJan = new Date(d.getFullYear(), 0, 1);
    //    return Math.ceil((((d - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
    //  }
      
    //  function isoWeekOfYear(d) {
    //    var target  = new Date(d.valueOf());  
    //    var dayNr   = (d.getDay() + 6) % 7;  
    //    target.setDate(target.getDate() - dayNr + 3);  
    //    var jan4    = new Date(target.getFullYear(), 0, 4);  
    //    var dayDiff = (target - jan4) / 86400000;
        
    //    return 1 + Math.ceil(dayDiff / 7);
    //  }
      
    //  function tweleveHour(d) {
    //    return d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
    //  }
      
    //  function timeZoneOffset(d) {
    //    var hoursDiff = (-d.getTimezoneOffset() / 60);
    //    var result = padNumber(Math.abs(hoursDiff), 4);
    //    return (hoursDiff > 0 ? "+" : "-") + result;
    //  }
      
    //  Date.prototype.format = function (formatString) {
    //    return formatString.replace(re, __bind(function (m, p) {
    //      switch (p) {
    //        case "a": return abbreviatedWeekdays[this.getDay()];
    //        case "A": return fullWeekdays[this.getDay()];
    //        case "b": return abbreviatedMonths[this.getMonth()];
    //        case "B": return fullMonths[this.getMonth()];
    //        case "c": return this.toLocaleString();
    //        case "C": return Math.round(this.getFullYear() / 100);
    //        case "d": return padNumber(this.getDate(), 2);
    //        case "D": return this.format("%m/%d/%y");
    //        case "e": return padNumber(this.getDate(), 2, " ");
    //        case "F": return this.format("%Y-%m-%d");
    //        case "h": return this.format("%b");
    //        case "H": return padNumber(this.getHours(), 2);
    //        case "I": return padNumber(tweleveHour(this), 2);
    //        case "j": return padNumber(dayOfYear(this), 3);
    //        case "k": return padNumber(this.getHours(), 2, " ");
    //        case "l": return padNumber(tweleveHour(this), 2, " ");
    //        case "L": return padNumber(this.getMilliseconds(), 3);
    //        case "m": return padNumber(this.getMonth() + 1, 2);
    //        case "M": return padNumber(this.getMinutes(), 2);
    //        case "n": return "\n";
    //        case "p": return this.getHours() > 11 ? "PM" : "AM";
    //        case "P": return this.format("%p").toLowerCase();
    //        case "r": return this.format("%I:%M:%S %p");
    //        case "R": return this.format("%H:%M");
    //        case "s": return this.getTime() / 1000;
    //        case "S": return padNumber(this.getSeconds(), 2);
    //        case "t": return "\t";
    //        case "T": return this.format("%H:%M:%S");
    //        case "u": return this.getDay() == 0 ? 7 : this.getDay();
    //        case "U": return padNumber(weekOfYear(this), 2); //either this or W is wrong (or both)
    //        case "v": return this.format("%e-%b-%Y");
    //        case "V": return padNumber(isoWeekOfYear(this), 2);
    //        case "W": return padNumber(weekOfYear(this), 2); //either this or U is wrong (or both)
    //        case "w": return padNumber(this.getDay(), 2);
    //        case "x": return this.toLocaleDateString();
    //        case "X": return this.toLocaleTimeString();
    //        case "y": return String(this.getFullYear()).substring(2);
    //        case "Y": return this.getFullYear();
    //        case "z": return timeZoneOffset(this);
    //        default: return match;
    //      }
    //    }, this));
    //  };
    //}).call(this);
};
