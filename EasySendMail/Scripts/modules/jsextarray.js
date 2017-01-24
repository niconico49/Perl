exports.jsextarray = function() {
    if (!Array.prototype.filter) {
      Array.prototype.filter = function(f) {
        if (typeof f != "function") {
          throw new TypeError();
        }
    
        var result = [];
        var length = this.length;
        var arg1 = arguments[1];
        for (var i = 0; i < length; i++) {
          if (i in this) {
            // in case f mutates this
            var value = this[i];
            if (f.call(arg1, value, i, this)) {
              result.push(value);
            }
          }
        }
        return result;
      };
    }
};
