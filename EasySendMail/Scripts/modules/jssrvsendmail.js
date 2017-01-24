var jssrv = require("./modules/jssrv.js").jssrv;
var jsdbconnect = require("./modules/jsdbconnect.js").jsdbconnect;
var jsmailconnect = require("./modules/jsmailconnect.js").jsmailconnect;
var jsfs = require("./modules/jsfs.js").jsfs;
var jshtml = require("./modules/jshtml.js").jshtml;

exports.jssrvsendmail = {
  sendMail : function() {
    var pathInfo = jssrv.getParameter('serverPathInfo');
    //Recupero Mail Internal
    var resultJSON = jsdbconnect.makeAndExecuteSql("MailInternal.Select.Where.Id", { "@ID": '1'});
    
    var mailInternal = resultJSON[0].MAIL;
    mailInternal = "mymail@mymail.com";
  
    var mailFrom = mailInternal;
    var mailTo = null;
    mailTo = mailInternal;
    //mailTo = "mymail@mymail.com,othermail@mymail.com";
    //mailTo = "test@mymail.com";
  
    var mailCc = "";
  
    var mailBcc = "";
    //var mailBcc = mailInternal;
    //var mailBcc = "n.manneschi@bltenterprise.it";
    
    var sendMail = jsmailconnect.getMailTemplateReference("SendMail");
    sendMail.RELATIVE_PATH = "/SendMail.html";
    //sendMail.RELATIVE_PATH = "/SendMailWithImageBackground.html";
  
    var html = "" + jsfs.getTxtFromFile(pathInfo + sendMail.RELATIVE_PATH) + "";
  
    var plane = jshtml.plane(html, pathInfo);
    html = plane.xml;
  
    var dictionaryInlineImg = plane.listAttachment;
  
    var subject = "AUGURI BUONE FESTE";
  
    var body = html;
  
    var mailAccount = jsmailconnect.getMailAccount("mail.bltenterprise.it");
  
  	var host = mailAccount.HOST;
  	var port = mailAccount.PORT;
  	var login = mailAccount.LOGIN;
  	var password = mailAccount.PASSWORD;
  
    var dictionaryParameters = {};
  
    dictionaryParameters["mailFrom"] = mailFrom;
    dictionaryParameters["mailTo"] = mailTo;
    dictionaryParameters["mailCc"] = mailCc;
    dictionaryParameters["mailBcc"] = mailBcc;
    dictionaryParameters["subject"] = subject;
    dictionaryParameters["body"] = body;
    dictionaryParameters["host"] = host;
    dictionaryParameters["port"] = port;
    dictionaryParameters["login"] = login;
    dictionaryParameters["password"] = password;
    var esitus = jsmailconnect.sendMail(dictionaryParameters, dictionaryInlineImg);
  
    var result = esitus;
    return result;
  }
};
