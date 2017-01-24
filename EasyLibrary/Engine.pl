#use strict;
#use warnings;
#use diagnostics; #mainly for debugging, to better understand the messages

require 'EasyAbstractNoScriptObject.pl';
require 'ComponentConnection.pl';
require 'ComponentDevelopment.pl';
require 'ComponentFile.pl';
require 'EasyComponentMail.pl';
require 'ComponentServer.pl';
require 'ComponentThread.pl';
require 'BatchSession.pl';
require 'WebSession.pl';
#require '../EasyLibrary/EasyAbstractNoScriptObject.pl';
#require '../EasyLibrary/ComponentConnection.pl';
#require '../EasyLibrary/ComponentDevelopment.pl';
#require '../EasyLibrary/ComponentFile.pl';
#require '../EasyLibrary/EasyComponentMail.pl';
#require '../EasyLibrary/ComponentServer.pl';
#require '../EasyLibrary/ComponentThread.pl';
#require '../EasyLibrary/BatchSession.pl';
#require '../EasyLibrary/WebSession.pl';

package Engine;

use JE;

#use JavaScript qw(:all);

my $iEngine = undef;

my $firstTime = 1;
my $scriptingCode = "";

=start
sub starter() {
    my ($class, $abstractNoScriptObject) = @_;

    my $path = ComponentServer->getParameter("serverPathInfo");
    my $languageProgramming = ComponentServer->getParameter("languageProgramming");

    my $scriptCode = ComponentFile->getTxtFromFile($path."/Scripts/Deployer.js");

    my $runtime = JavaScript::Runtime->new;
    $iEngine = JavaScript::Context->new($runtime);

    $class->bindClasses($iEngine);

    $iEngine->bind_object(AbstractNoScriptObject => $abstractNoScriptObject);

    $iEngine->eval($scriptCode);

    ComponentThread->setParams($iEngine, $scriptCode, $abstractNoScriptObject);

    $scriptCode = $iEngine->call("starter", $languageProgramming);
    #print "==>Here\n"; 
    #print "===>".$scriptCode."\n<======\n"; 
   
    #print "starter: ".$scriptCode."\n";
    #$scriptCode = $iEngine->eval("starter('".$languageProgramming."');");
    
    #$iEngine->addObject("AbstractNoScriptObject", $abstractNoScriptObject);
    #var_dump($scriptCode);
    #$iEngine->execute(scriptCode);

    #$scriptCode = $iEngine->invokeMethod("starter", $languageProgramming);

    $scriptingCode = $scriptCode;
}
=cut

sub starter() {
    my ($class, $abstractNoScriptObject) = @_;

    my $path = ComponentServer->getParameter("serverPathInfo");
    my $languageProgramming = ComponentServer->getParameter("languageProgramming");

    my $scriptCode = ComponentFile->getTxtFromFile($path."/Scripts/Deployer.js");

    $iEngine = new JE;

    $class->bindClasses($iEngine);

    $iEngine->eval($scriptCode);

    ComponentThread->setParams($iEngine, $scriptCode, $abstractNoScriptObject);

    $scriptCode = $iEngine->{starter}->($languageProgramming);
    #print "==>Here\n"; 
    #print "===>".$scriptCode."\n<======\n"; 
   
    #print "starter: ".$scriptCode."\n";
    #$scriptCode = $iEngine->eval("starter('".$languageProgramming."');");
    
    #$iEngine->addObject("AbstractNoScriptObject", $abstractNoScriptObject);
    #var_dump($scriptCode);
    #$iEngine->execute(scriptCode);

    #$scriptCode = $iEngine->invokeMethod("starter", $languageProgramming);
    $scriptingCode = $scriptCode;
}

sub execute() {
    my ($class, $functionName, $abstractNoScriptObject, $parameters) = @_;

    my $result = "";

    if ($firstTime) {
        #$abstractNoScriptObject->setComponentEngine($iEngine);

        $firstTime = 0;
       
        $class->bindClasses($iEngine);

        $iEngine->eval($scriptingCode);

        $result = $iEngine->{$functionName}->($parameters);
    }
    else {
        $class->bindClasses($iEngine);

        $result = $iEngine->{$functionName}->($parameters);
    }

    return $result;
}

sub scriptEngine() {
    my ($class, $operationType, $functionName, $abstractNoScriptObject, $parameters) = @_;

    my $result = "";
    
    if ($operationType eq "StarterAndExecute") {
      $class->starter($abstractNoScriptObject);
      $result = $class->execute($functionName, $abstractNoScriptObject, $parameters);
    }
    elsif ($operationType eq "Starter") {
      $class->starter($abstractNoScriptObject);
    }
    elsif ($operationType eq "Execute") {
      $result = $class->execute($functionName, $abstractNoScriptObject, $parameters);
    }
    return $result;
}

sub dynamicInvoke() {
    my ($class, $operationType, $functionName, $abstractNoScriptObject, $args) = @_;

    my $result = $class->scriptEngine($operationType, $functionName, $abstractNoScriptObject, $args);
		return $result;
}

#static
sub interact() {
  my ($class, $jsonData, $iSession, $path, $operationType) = @_;

  ComponentServer->addParameter("serverPathInfo", $path);
  ComponentServer->addParameter("languageProgramming", "Perl");

  $abstractNoScriptObject = EasyAbstractNoScriptObject->getInstance();

  $abstractNoScriptObject->setComponentConnection(ComponentConnection->getInstance());
  $abstractNoScriptObject->setComponentDevelopment(ComponentDevelopment->getInstance());
  $abstractNoScriptObject->setComponentFile(ComponentFile->getInstance());
  $abstractNoScriptObject->setComponentServer(ComponentServer->getInstance());
  $abstractNoScriptObject->setComponentThread(ComponentThread->getInstance());
  $abstractNoScriptObject->setComponentSession($iSession);
  $abstractNoScriptObject->setComponentMail(EasyComponentMail->getInstance());
  
	$result = Engine->dynamicInvoke($operationType, "execute", $abstractNoScriptObject, $jsonData);

	return $result;
}

sub bindClasses() {
  my ($class, $iEngine) = @_;

  my $nameClass = 'EasyAbstractNoScriptObject'; 
  $iEngine->bind_class(
    name => "AbstractNoScriptObject",
    package => $nameClass,
    constructor => sub {},
    static_methods => {
      getComponentServer => $nameClass->can('getComponentServer'),
      getComponentThread => $nameClass->can('getComponentThread'),
      getComponentConnection => $nameClass->can('getComponentConnection'),
      getComponentDevelopment => $nameClass->can('getComponentDevelopment'),
      getComponentFile => $nameClass->can('getComponentFile'),
      getComponentMail => $nameClass->can('getComponentMail'),
      getComponentSession => $nameClass->can('getComponentSession')
    },
    flags => JS_CLASS_NO_INSTANCE
  );

  $nameClass = 'ComponentConnection'; 
  $iEngine->bind_class(
    name => $nameClass,
    package => $nameClass,
    constructor => sub {},
    methods => {
      getInstance => $nameClass->can('getInstance'),
      open => $nameClass->can('open'),
      bindParameter => $nameClass->can('bindParameter'),
      prepareStatement => $nameClass->can('prepareStatement'),
      executeQuery => $nameClass->can('executeQuery'),
      executeNonQuery => $nameClass->can('executeNonQuery'),
      isBof => $nameClass->can('isBof'),
      isEof => $nameClass->can('isEof'),
      moveNext => $nameClass->can('moveNext'),
      columnCount => $nameClass->can('columnCount'),
      columnName => $nameClass->can('columnName'),
      columnType => $nameClass->can('columnType'),
      columnValue => $nameClass->can('columnValue'),
      close => $nameClass->can('close')
    },
    flags => JS_CLASS_NO_INSTANCE
  );
  
  $nameClass = 'ComponentDevelopment'; 
  $iEngine->bind_class(
    name => $nameClass,
    package => $nameClass,
    constructor => sub {},
    methods => {
      displayValue => $nameClass->can('displayValue')
    },
    flags => JS_CLASS_NO_INSTANCE
  );
  
  $nameClass = 'ComponentFile'; 
  $iEngine->bind_class(
    name => $nameClass,
    package => $nameClass,
    constructor => sub {},
    methods => {
      getTxtFromFile => $nameClass->can('getTxtFromFile'),
      getTxtFromFileByUrl => $nameClass->can('getTxtFromFileByUrl'),
      fileExist => $nameClass->can('fileExist'),
      directoryExist => $nameClass->can('directoryExist'),
      copyDirectory => $nameClass->can('copyDirectory')
    },
    flags => JS_CLASS_NO_INSTANCE
  );
  
  $nameClass = 'EasyComponentMail'; 
  $iEngine->bind_class(
    name => $nameClass,
    package => $nameClass,
    constructor => sub {},
    methods => {
      getInstance => $nameClass->can('getInstance'),
      setHost => $nameClass->can('setHost'),
      setPort => $nameClass->can('setPort'),
      setLogin => $nameClass->can('setLogin'),
      setPassword => $nameClass->can('setPassword'),
      setMailFrom => $nameClass->can('setMailFrom'),
      setMailTo => $nameClass->can('setMailTo'),
      setMailCc => $nameClass->can('setMailCc'),
      setMailBcc => $nameClass->can('setMailBcc'),
      setSubject => $nameClass->can('setSubject'),
      setBody => $nameClass->can('setBody'),
      prepare => $nameClass->can('prepare'),
      addContentId => $nameClass->can('addContentId'),
      send => $nameClass->can('send')
    },
    flags => JS_CLASS_NO_INSTANCE
  );
  
  #getServerPathInfo => $nameClass->can('getServerPathInfo'),
  #getLanguageProgramming => $nameClass->can('getLanguageProgramming')
  $nameClass = 'ComponentServer'; 
  $iEngine->bind_class(
    name => $nameClass,
    package => $nameClass,
    constructor => sub {},
    methods => {
      execCmd => $nameClass->can('execCmd'),
      getDictionary => $nameClass->can('getDictionary'),
      addParameter => $nameClass->can('addParameter'),
      getParameter => $nameClass->can('getParameter'),
      removeParameter => $nameClass->can('removeParameter'),
      clearParameter => $nameClass->can('clearParameter')
    },
    flags => JS_CLASS_NO_INSTANCE
  );

  $nameClass = 'ComponentThread'; 
  $iEngine->bind_class(
    name => $nameClass,
    package => $nameClass,
    constructor => sub {},
    methods => {
      setThreadTimer => $nameClass->can('setThreadTimer'),
      cancelThreadTimer => $nameClass->can('cancelThreadTimer')
    },
    flags => JS_CLASS_NO_INSTANCE
  );
  
  $nameClass = 'BatchSession'; 
  $iEngine->bind_class(
    name => $nameClass,
    package => $nameClass,
    constructor => sub {},
    methods => {
      getAttribute => $nameClass->can('getAttribute'),
      setAttribute => $nameClass->can('setAttribute'),
      removeAllAttribute => $nameClass->can('removeAllAttribute')
    },
    flags => JS_CLASS_NO_INSTANCE
  );

  $nameClass = 'WebSession'; 
  $iEngine->bind_class(
    name => $nameClass,
    package => $nameClass,
    constructor => sub {},
    methods => {
      getAttribute => $nameClass->can('getAttribute'),
      setAttribute => $nameClass->can('setAttribute'),
      removeAllAttribute => $nameClass->can('removeAllAttribute')
    },
    flags => JS_CLASS_NO_INSTANCE
  );
}
1;
