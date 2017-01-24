require 'Engine.pl';
require 'BatchSession.pl';
#require '../EasyLibrary/Engine.pl';
#require '../EasyLibrary/BatchSession.pl';

package EasySendMail;

use Cwd;
use Win32::NetResource qw(GetUNCName);

sub main() {
    my ($class, $args) = @_;
		my $jsonData = "";
    my $operationType = "StarterAndExecute";
    GetUNCName($path, getcwd());
    print("path==>");
    print($path);
    #my $path = getcwd();
    Engine->interact($jsonData, new BatchSession({}), $path, $operationType);
}

EasySendMail->main("");
1;
