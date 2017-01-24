use MIME::Lite;
use MIME::Base64;
use Authen::SASL;

#require '../EasyLibrary/EasyComponentDictionary.pl';

package EasyComponentMail;

sub getInstanceFactory() {
  my $class = shift;
  my $self = {
      _mail => undef, 
      _host => undef, 
      _port => undef,
      _login => undef,
      _password => undef,
      _mailFrom => undef,
      _mailTo => undef,
      _mailCc => undef,
      _mailBcc => undef,
      _subject => undef,
      _body => undef
  };
  bless $self, $class;
  return $self;   
}      

sub getInstance() {
  return EasyComponentMail->getInstanceFactory();
}      
=start
sub getInstance() {  
  my $class = shift;
  my $self = {
      _mail => undef, 
      _host => undef, 
      _port => undef,
      _login => undef,
      _password => undef,
      _mailFrom => undef,
      _mailTo => undef,
      _mailCc => undef,
      _mailBcc => undef,
      _subject => undef,
      _body => undef
  };
  bless $self, $class;
  return $self;   
}      
=cut

sub setHost() {
    my ($class, $value) = @_;
    $class->{_host} = $value; 
}

sub setPort() {
    my ($class, $value) = @_;
    $class->{_port} = $value; 
}

sub setLogin() {
    my ($class, $value) = @_;
    $class->{_login} = $value; 
}

sub setPassword() {
    my ($class, $value) = @_;
    $class->{_password} = $value; 
}

sub setMailFrom() {
    my ($class, $value) = @_;
    $class->{_mailFrom} = $value; 
}

sub setMailTo() {
    my ($class, $value) = @_;
    $class->{_mailTo} = $value; 
}

sub setMailCc() {
    my ($class, $value) = @_;
    $class->{_mailCc} = $value; 
}

sub setMailBcc() {
    my ($class, $value) = @_;
    $class->{_mailBcc} = $value; 
}

sub setSubject() {
    my ($class, $value) = @_;
    $class->{_subject} = $value; 
}

sub setBody() {
    my ($class, $value) = @_;
    $class->{_body} = $value; 
}

sub prepare() {
    my ($class) = @_;


    #my $type = 'multipart/alternative'; 
    my $type = 'multipart/related'; 
=start
    $class->{_mail} = MIME::Lite::->new(
      'From' => $class->{_mailFrom},
      'To' => $class->{_mailTo},
      'Cc' => $class->{_mailCc},
      'Bcc' => $class->{_mailBcc},
      'Subject' => $class->{_subject},
      'Type' => $type,
      'Data' => $class->{_body}
    );

    $class->{_mail}->attr("Content-Type" => "text/html"); 
=cut
    $class->{_mail} = MIME::Lite::->new(
      'From' => $class->{_mailFrom},
      'To' => $class->{_mailTo},
      'Cc' => $class->{_mailCc},
      'Bcc' => $class->{_mailBcc},
      'Subject' => $class->{_subject},
      'Type' => $type
    );

    $class->{_mail}->attach(
        Type => 'text/html',
        Data => $class->{_body},
        Encoding => 'quoted-printable'
    );
}

sub addContentId() {
    my ($class, $key, $value) = @_;
    my $type = 'AUTO';
    #my $type = 'image/png';
    $class->{_mail}->attach(
      Type => $type,
      Id   => $key,
      Path => $value,
    );
}

sub send() {
    my ($class) = @_;
    $class->{_mail}->send('smtp', $class->{_host}, Port => $class->{_port}, AuthUser => $class->{_login}, AuthPass => $class->{_password});
}
1;
