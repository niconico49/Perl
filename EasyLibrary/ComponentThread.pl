require 'Engine.pl';
#require '../EasyLibrary/Engine.pl';

package ComponentThread;

use threads;

my $hashSet = {};

my $_iEngine = undef;
my $_scriptCode = undef;
my $_abstractNoScriptObject = undef;

sub getInstance() {  
  my $class = shift;
  my $self = {};
  bless $self, $class;
  return $self;   
}      

sub setParams() {
  my($class, $iEngine, $scriptCode, $abstractNoScriptObject) = @_;
  $_iEngine = $iEngine;
  $_scriptCode = $scriptCode;
  $_abstractNoScriptObject = $abstractNoScriptObject;
}

sub timerTask {
  my($fn, $interval, $maxIteration, @args) = @_;
  
  $SIG{'KILL'} = sub { threads->exit(); };

  for (my $count = 1; $maxIteration == 0 || $count <= $maxIteration; $count++) {
    #print "timerTask args==>".join("\n", @args)."\n\n";

    sleep $interval;
    #&$fn;

    #print "timerTask==>fn==>".$fn."\n";
    #print "timerTask==>_scriptCode==>".$_scriptCode."\n";

    Engine->bindClasses($_iEngine);

    $_iEngine->unbind_value('AbstractNoScriptObject');
    $_iEngine->bind_object(AbstractNoScriptObject => $_abstractNoScriptObject);

    $result = $_iEngine->call($fn, @args);

    #$result = $fn->(@args);
    #print "timerTask==>result==>".$result."\n\n\n";
  }
}

sub setThreadTimer() {
  my ($class, $fn, $delay, $onlyOnce, $id, @args) = @_;
  #print "startTimer args==>".join("\n", @args)."\n\n";

  $onlyOnce = ($onlyOnce eq "true") ? 1 : 0;

  if ($onlyOnce) {
    $thread = threads->create(\&timerTask, $fn, $delay / 1000, 1, @args);
  }
  else {
    $thread = threads->create(\&timerTask, $fn, $delay / 1000, 0, @args);
  }
  
  $thread->detach;
  $hashSet{$id} = $thread;  
  return $id;
}

sub cancelThreadTimer() {
  my ($class, $id) = @_;

  if (exists($hashSet{$id})) {
    $thread = $hashSet{$id};
    #undef $timer;
    delete $hashSet{$id};
    #$timer->kill('KILL')->detach();
    $thread->kill('KILL');
  }
}
1;
