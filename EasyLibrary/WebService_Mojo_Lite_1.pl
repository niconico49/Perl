use Cwd;

require '../EasyLibrary/Engine.pl';
require '../EasyLibrary/BatchSession.pl';
require '../EasyLibrary/ComponentServer.pl';
require '../EasyLibrary/WebSession.pl';

package WebService;

#################################################################
#N.B: Mojolicious::Lite is a micro web server listening port 3000
#################################################################
use Mojolicious::Lite;

my $cwd = undef;
my $isStarted = 0;

sub setCwd() {
  my ($class, $value) = @_;
  $cwd = $value;
}

sub getCwd() {
  my ($class) = @_;
  return $cwd; 
}

sub start() {
  my ($class, $path) = @_;

  $class->setCwd($path);

  app->static->paths->[0] = $cwd;
  
  my $batchSession = BatchSession->getInstance();

  my $result = $class->execute("{}", $batchSession); 

  app->start;
  #run(host = $class->getHost(), port = $class->getPort());
  
  return $result;
}

sub execute() {
  my ($class, $jsonData, $session) = @_;
  my $path = $class->getCwd();
	
  ComponentServer->addParameter("WebService.type", "Classic");
  ComponentServer->addParameter("WebService.path", "webresources/api/execute");

  my $operationType = "";

  if (!$isStarted) {
    $isStarted = 1;
    $operationType = "Starter";
  }
  else {
    $operationType = "Execute";
  }
  
  return Engine->interact($jsonData, $session, $path, $operationType);
}

sub httpListenerStop() {
}

=start
sub getHost() {
  return "127.0.0.1";
}

sub getPort() {
  return "3000";
}
=cut

any '/:projectName/' => sub {
  my $shift = shift;
  $shift->render_static('Starter.html');
};

post '/:projectName/webresources/api/execute' => sub {
  my $shift = shift;
  my $session = $shift->session;
  my $jsonData = @{$shift->req->json}{'jsonData'};
  #my $webSession = WebSession->new($session);
  my $webSession = WebSession->getInstance();
  $webSession->setSession($session);
  my $result = WebService->execute($jsonData, $webSession);
  
  return $shift->render( text => $result );
  #return $shift->execute($jsonData, $webSession);
};

any '/:projectName/*fileName' => sub {
  my $shift = shift;
  my $fileName = $shift->param('fileName');
  $shift->render_static($fileName);
};

=start
get '/' => sub {
  my $shift = shift;
  $shift->render_static('TestDefault.html');
};
=cut
