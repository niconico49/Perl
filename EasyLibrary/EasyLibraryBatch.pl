use Cwd;

require '../EasyLibrary/Engine.pl';
require '../EasyLibrary/BatchSession.pl';

package EasyLibraryBatch;

sub main() {
    my ($class, $args) = @_;
		my $jsonData = "";
    my $operationType = "StarterAndExecute";
    my $path = getcwd();
    Engine->interact($jsonData, new BatchSession({}), $path, $operationType);
}

EasyLibraryBatch->main("");
1;
