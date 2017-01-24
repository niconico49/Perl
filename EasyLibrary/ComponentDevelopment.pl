package ComponentDevelopment;

sub getInstance() {  
  my $class = shift;
  my $self = {};
  bless $self, $class;
  return $self;   
}      

sub displayValue() {
    my ($class, $value) = @_;
    print $value."\n";
}
1;
