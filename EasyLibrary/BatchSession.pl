package BatchSession;

sub new {
    my $class = shift;
    my $self = {
        _hashMap => shift
    };
    # Print all the values just for clarification.
    bless $self, $class;
    return $self;
}

sub getInstance() {
  return BatchSession->new();
=start
  my $class = shift;
  my $self = {
    _hashMap => {} 
  };
  bless $self, $class;
  return $self;   
=cut
}      

sub getAttribute() {
  my ($class, $key) = @_;
  return $self->{_hashMap}{$key};  
}

sub setAttribute() {
  my ($class, $key, $value) = @_;
  $self->{_hashMap}{$key} = $value;  
}

sub removeAllAttribute() {
  %{$self->{_hashMap}} = ();
}
1;
