var Enumerable = require('./modules/linq.js');
var jsprvmailaccount = require("./modules/jsprvmailaccount.js").jsprvmailaccount;
var jsprvmailtemplate = require("./modules/jsprvmailtemplate.js").jsprvmailtemplate;
var jsmail = require("./modules/jsmail.js").jsmail;

exports.jsmailconnect = {
    getMailAccount: function(idMailAccount) {
        var mailAccount = Enumerable.from(jsprvmailaccount.Records)
          .where(function(item){ return item.ID_MAIL_ACCOUNT == idMailAccount; })
          .toArray();
    
        return mailAccount[0];
    },
    getMailTemplateReference: function(idMailTemplateReference) {
        var mailAccount = Enumerable.from(jsprvmailtemplate.Records)
          .where(function(item){ return item.ID_MAIL_TEMPLATE_REFERENCE == idMailTemplateReference; })
          .toArray();
    
        return mailAccount[0];
    },
    sendMail: function(dictionaryParameters, dictionaryInlineImg) {
        var componentMail = jsmail.getInstance();
    
        componentMail.setHost(dictionaryParameters["host"]);
        componentMail.setPort(dictionaryParameters["port"]);
        componentMail.setLogin(dictionaryParameters["login"]);
        componentMail.setPassword(dictionaryParameters["password"]);
    
        componentMail.setMailFrom(dictionaryParameters["mailFrom"]);
        componentMail.setMailTo(dictionaryParameters["mailTo"]);
        componentMail.setMailCc(dictionaryParameters["mailCc"]);
        componentMail.setMailBcc(dictionaryParameters["mailBcc"]);
        componentMail.setSubject(dictionaryParameters["subject"]);
        componentMail.setBody(dictionaryParameters["body"]);
    
        componentMail.prepare();

        for (var i = 0; i < dictionaryInlineImg.length; i++) {
          var item = dictionaryInlineImg[i];
          var key = item.key;
          var value = item.value;
          componentMail.addContentId(key, value);
        }

        var result = componentMail.send();
        return result;
    }
};
