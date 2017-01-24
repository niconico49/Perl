package GenericResource;

//static
sub execute() {
    my ($class, $jsonData) = @_;
    ComponentServer->addParameter("WebService.type", "Classic");
    ComponentServer->addParameter("WebService.path", "webresources/api/execute");

    my $path = $_SERVER['DOCUMENT_ROOT'];
    my $operationType = "Execute";
    return Engine->interact($jsonData, new WebSession($_SESSION), $path, $operationType);
}
1;
