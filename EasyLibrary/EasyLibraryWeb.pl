use Cwd;

require '../EasyLibrary/Engine.pl';

package EasyLibraryWeb:
  
my $applicationStarted = 0;
  
sub execute() {
    my ($class, $jsonData) = @_;
    
    ComponentServer->addParameter("WebService.type", "Classic");
    ComponentServer->addParameter("WebService.path", "webresources/api/execute");

    my $operationType = "";

    if (!$applicationStarted):
      $applicationStarted = 1;
      $operationType = "Starter";
    else:
      $operationType = "Execute";
  
    my $path = getcwd;

    Engine->interact($jsonData, new WebSession(), $path, $operationType);
}

EasyLibraryWeb->execute("");
1;
