package WebSession;

=start      
sub new {  
  my $class = shift;
  my $self = {
    _session = {} 
  };
  bless $self, $class;
  return $self;  
}      
=cut
sub getInstanceFactory() {
  my $class = shift;
  my $self = {
    _arrayList => {} 
  };
  bless $self, $class;
  return $self;   
}      

sub getInstance() {
  return WebSession->getInstanceFactory();
}      

sub setSession() {
  my ($class, $session) = @_;
  $self->{_session} = $session;  
}

sub getAttribute() {
  my ($class, $key) = @_;
  return $self->{_session}{$key};  
}

sub setAttribute() {
  my ($class, $key, $value) = @_;
  $self->{_session}{$key} = $value;  
}

sub removeAllAttribute() {
  %{$self->{_session}} = ();
}
1;
