use Cwd;

require '../EasyLibrary/Engine.pl';
require '../EasyLibrary/BatchSession.pl';
require '../EasyLibrary/ComponentServer.pl';
require '../EasyLibrary/WebSession.pl';

package WebService;

use HTTP::Server::Simple::CGI;
#use HTTP::Server::Simple::Static;
use base qw(HTTP::Server::Simple::CGI);
use Switch;

my $projectName = undef;
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

sub setProjectName() {
  my ($class, $value) = @_;
  $projectName = $value;
}

sub getProjectName() {
  my ($class) = @_;
  return $projectName; 
}

sub start {
  my ($class, $path, $projectName) = @_;

  $class->setCwd($path);
  $class->setProjectName($projectName);
  
  my $batchSession = BatchSession->getInstance();

  my $result = $class->execute("{}", $batchSession); 

  # start the server on port 7777
  my $pid = WebService->new(7777)->background();
  print "Use 'kill $pid' to stop server.\n";
}

sub threadInteract() {
  my $jsonData  = shift;
  my $session  = shift;
  my $path  = shift;
  my $operationType  = shift;
  return Engine->interact($jsonData, $session, $path, $operationType);
}

sub execute() {
  my ($class, $jsonData, $session) = @_;
  my $path = WebService->getCwd();
	
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

sub handle_request {
  my $self = shift;
  my $cgi  = shift;
  
  my $path_info = $cgi->path_info();
  
  my $slashProjectName = "/".WebService->getProjectName();
 
  my $switchCmd = -1; 
 
  if ($path_info eq $slashProjectName
      or
      $path_info eq $slashProjectName."/"
  ) {
    $switchCmd = 0;
  }
  elsif($path_info eq $slashProjectName."/webresources/api/execute") {
    $switchCmd = 1;
  }
  elsif (index($path_info, $slashProjectName) > -1) {
    $switchCmd = 2;
  }

  print "HTTP/1.0 200 OK\r\n";
  switch ($switchCmd) {
    case 0 {
      WebService->makeOutputStreamFromFileName(WebService->getCwd()."/Starter.html");
    }
    case 1 {
      my $requestData = $cgi->param("POSTDATA");
      my $batchSession = BatchSession->getInstance();

      use JSON qw( decode_json );
      my $decoded = decode_json($requestData);
      
      my $jsonData = $decoded->{'jsonData'};
      print "Content-type: text/plain\n\n";
      
      #use threads;
      #my $thread = threads->create(\&threaded, $jsonData, $batchSession);
      #my $result = $thread->join();
      #$thread->detach;

      my $result = WebService->execute($jsonData, $batchSession);
      print $result;
    }
    case 2 {
      $projectNameSize = length($slashProjectName);
      $uriSize = length($path_info);

      $fileName = WebService->getCwd().substr($path_info, index($path_info, $slashProjectName) + $projectNameSize, $uriSize - $projectNameSize);
      WebService->makeOutputStreamFromFileName($fileName);
    }
  }
=start
  if ($path_info eq $slashProjectName
      or
      $path_info eq $slashProjectName."/"
  ) {
  print "starter=>".WebService->getCwd()."Starter.html"."\n<br>";
    print "HTTP/1.0 200 OK\r\n";
    print $cgi->header,
      $cgi->start_html("respStarter"),
      $cgi->h1($path_info eq $slashProjectName),
      $cgi->h5($path_info eq $slashProjectName."/"),
      $cgi->end_html;
  }
  elsif($path_info eq $slashProjectName."/webresources/api/execute") {
    #my $request = $cgi->get_request;
    my $request = $cgi->param("POSTDATA");
    my $test = $cgi->param;
    print "HTTP/1.0 200 OK\r\n";
    print $cgi->header,
      $cgi->start_html("respWebResource"),
      $cgi->h1($path_info eq $slashProjectName."/webresources/api/execute"),
      $cgi->h1("/webresources/api/execute"),
      #$cgi->h1($request->as_string),
      $cgi->h1($request),
      $cgi->h1($test),
      $cgi->end_html;
  }
  elsif (false) {
    print "Content-type: image/png\n\n";
    open(BIN, "image.png");
    print while <BIN>;
    close(BIN);
    #exit 0;
  }
  else {
    print "HTTP/1.0 404 Not found\r\n";
    print $cgi->header,
    $cgi->start_html('Not found'),
    $cgi->h1('Not found'),
    $cgi->end_html;
  }
=cut  
}

sub makeOutputStream() {
  my $self = shift;
  my $buffer  = shift;
  print $buffer;
}

sub makeOutputStreamFromFileName() {
  my $self = shift;
  my $fileName  = shift;

  my $fileExtension = WebService->fileNameExtension($fileName);
  my $contentType = WebService->contentType($fileExtension);

  print "Content-type: ".$contentType."\n\n";
  #byte[] buffer = ComponentFile.getBufferFromFileShared(fileName);
  open(BIN, $fileName);
  print while <BIN>;
  close(BIN);
}

sub fileNameExtension() {
  my $self = shift;
  my $fileName  = shift;

  my $result = substr($fileName, rindex($fileName, ".") + 1);
  return $result;
}

sub contentType() {
  my $self = shift;
  my $value  = shift;
  my $result = "text/plain";

  switch ($value) {
    case ["htm", "html"] {
      $result = "text/html";
    }
    case "css" {
      $result = "text/css";
    }
    case "less" {
      $result = "text/less";
    }
    case "bmp" {
      $result = "image/bmp";
    }
    case "cod" {
      $result = "image/cis-cod";
    }
    case "png" {
      $result = "image/png";
    }
    case "gif" {
      $result = "image/gif";
    }
    case "ief" {
      $result = "image/ief";
    }
    case ["jpe", "jpeg", "jpg"] {
      $result = "image/jpeg";
    }
    case "jfif" {
      $result = "image/pipeg";
    }
    case "svg" {
      $result = "image/svg+xml";
    }
    case ["tif", "tiff"] {
      $result = "image/tiff";
    }
    case "js" {
      $result = "application/javascript";
    }
  }
  return $result;
}
1;
