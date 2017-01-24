require("./modules/jsextarray.js").jsextarray();

var squel = require("./modules/squel.js");

exports.jscustomquery = {
    makerSql: function(languageProgramming) {
        var queryTable = {
            "MailInternal.Select.Where.Id": squel.select()
                .from("TABLE_MAIL_INTERNAL")
                .field("MAIL")
                .where("ID = @ID")
                .toString()
        };
        return queryTable;
    }
};
