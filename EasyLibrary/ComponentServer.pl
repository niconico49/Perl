package ComponentServer;

my $hashSet = {"languageProgramming" => "Perl"};
=start 
my $serverPathInfo = undef;

my $languageProgramming = "Perl";

sub getInstance() {  
  my $class = shift;
  my $self = {};
  $hashSet = {"languageProgramming" => "Perl"};
  bless $self, $class;
  return $self;   
}      

sub setServerPathInfo() {
    my ($class, $value) = @_;
    $serverPathInfo = $value;
}

sub getServerPathInfo() {
  return $serverPathInfo;
}

sub getLanguageProgramming() {
  return $languageProgramming;
}
=cut

sub execCmd() {
  my ($class, $cmd, $args) = @_;

  my $cmdWithParams = $cmd." ".$args;
  #my $result = "";
=start
  my $cmdArray = [
    "Z:/18 - DEV - Sviluppo/NicoManneschi/Perl/EasySendMailWarning/Binary/PhantomJs/phantomjs.exe",
    "Z:/18 - DEV - Sviluppo/NicoManneschi/Perl/EasySendMailWarning/Scripts/CodeBehind/Server/JsPhantomJs.js",
    "http://127.0.0.1:7777/EasySendMailWarning/Master.html?Content=Login&LANGUAGE_PROGRAMMING=Cpp&WEB_SERVICE_TYPE=Classic&WEB_SERVICE_PATH=webresources/api/execute&ID_INTERVENTO=312&ID_CONDITION=0"
  ];
  
  use IPC::Cmd qw[can_run run run_forked];
  
  ### in scalar context ###
  my $result;
  if( scalar run( command => $cmdWithParams,
                  verbose => 0,
                  buffer  => \$result,
                  timeout => 20 )
  ) {
      print "<h1>".$result."</h1>\n";
  }
=cut
=start
  #use EV;
  use AnyEvent;  
  use AnyEvent::Util 'fork_call';

  my $cv = AE::cv;
  $cv->begin;
  fork_call {
      return `$cmdWithParams`; 
      #my $stdout = `$cmdWithParams`;
      #return $stdout;
  } sub {
      $result = shift;
      $cv->end;
  };  
  #$cv->recv;
=cut
=start
  use Mojolicious::Lite;
  plugin 'Mojolicious::Plugin::ForkCall';
  
  $class->fork_call(
    sub {
      my ($args) = @_;
      return `$args`;
    },
    [$cmdWithParams],
    sub {
      my ($class, $return) = @_;
      $result = $return;
    }
  );
=cut
=start
  use Mojo::IOLoop::ForkCall;
  my $fc = Mojo::IOLoop::ForkCall->new;
  $fc->run(
    sub {
      my ($args) = @_;
      my $test = `$args`;
      $result = $test;
  print "result1:\n".$result."\n<======result1\n";
      return $result; 
      #return `$args`;
    },
    [$cmdWithParams],
    sub {
  #print "result2:\n".$result."\n<======result2\n";
      #return $result
      #my ($fc, $err, $return) = @_; 
      #my ($fc, $return) = @_; 
  #print "return: ".$return."\n";
      #$result = $return;
    }
  );
  $fc->ioloop->start unless $fc->ioloop->is_running;
=cut
  #my $result = qx/$cmdWithParams/;
  my $result = `$cmdWithParams`;
  #print "result: ".$result."\n";
  return $result;
}

sub getInstance() {  
  my $class = shift;
  my $self = {
  };
  bless $self, $class;
  return $self;   
}      

sub getDictionary() {
  my ($class) = @_;
  #return @{$self->{_hashSet}}; 
  return $hashSet;
}      

sub addParameter() {
  my ($class, $key, $value) = @_;
  $hashSet{$key} = $value;  
}      

sub getParameter() {
  my ($class, $key) = @_;
  return $hashSet{$key};  
}      
 
sub removeParameter() {
  my ($class, $key) = @_;
  delete $hashSet{$key};
}  

sub clearParameter() {
  my ($class) = @_;
  $hashSet = {};
}
1;
