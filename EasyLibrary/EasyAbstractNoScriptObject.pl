package EasyAbstractNoScriptObject;

sub getInstance() {
    my $class = shift;
    my $self = {
      _componentConnection => undef, 
      _componentDictionary => undef, 
      _componentDevelopment => undef, 
      _componentFile => undef, 
      _componentMail => undef, 
      _componentServer => undef, 
      _componentThread => undef, 
      _iSession => undef, 
      _iEngine => undef 
    };
    bless $self, $class;
    return $self;   
}

sub new {
=start
 my $class = shift;
 my $self  = {};
 #$one ||=
 bless $self, $class;
=cut
}

sub getComponentConnection() {
  my ($class) = @_;
  return $self->{_componentConnection};
}

sub setComponentConnection() {
  my ($class, $componentConnection) = @_;
  $self->{_componentConnection} = $componentConnection;
}

sub getComponentDevelopment() {
  my ($class) = @_;
  return $self->{_componentDevelopment};
}

sub setComponentDevelopment() {
  my ($class, $componentDevelopment) = @_;
  $self->{_componentDevelopment} = $componentDevelopment;
}

sub getComponentFile() {
  my ($class) = @_;
  return $self->{_componentFile};
}

sub setComponentFile() {
  my ($class, $componentFile) = @_;
  $self->{_componentFile} = $componentFile;
}

sub getComponentMail() {
  my ($class) = @_;
  return $self->{_componentMail};
}

sub setComponentMail() {
  my ($class, $componentMail) = @_;
  $self->{_componentMail} = $componentMail;
}

sub getComponentServer() {
  my ($class) = @_;
  return $self->{_componentServer};
}

sub setComponentServer() {
  my ($class, $componentServer) = @_;
  $self->{_componentServer} = $componentServer;
}

sub getComponentThread() {
  my ($class) = @_;
  return $self->{_componentThread};
}

sub setComponentThread() {
  my ($class, $componentThread) = @_;
  $self->{_componentThread} = $componentThread;
}

sub getComponentSession() {
  my ($class) = @_;
  return $self->{_iSession};
}

sub setComponentSession() {
  my ($class, $iSession) = @_;
  $self->{_iSession} = $iSession;
}

sub getComponentEngine() {
  my ($class) = @_;
  return $self->{_iEngine};
}

sub setComponentEngine() {
  my ($class, $iEngine) = @_;
  $self->{_iEngine} = $iEngine;
}
1;
