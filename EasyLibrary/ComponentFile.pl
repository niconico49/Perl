package ComponentFile;
#use Moose;
use File::Slurp;
use LWP::Simple;

sub getInstance() {  
  my $class = shift;
  my $self = {};
  bless $self, $class;
  return $self;   
}      

sub getTxtFromFile() {
    my ($class, $path) = @_;
    my $content = read_file($path);
    return $content;   
}      

sub writeFileFromTxt() {
    my ($class, $path, $value) = @_;
    write_file($path, $value);
    return;   
}      

sub getTxtFromFileByUrl() {
    my ($class, $url) = @_;  
    #urlencode();
    my $content = get $url;  
    return $content;   
}      

sub fileRename() {
    my ($class, $pathSource, $pathDest) = @_;  
    rename($pathSource, $pathDest);
} 

sub fileDelete() {
    my ($class, $path) = @_;  
    unlink($path);
} 

sub fileExist() {
    my ($class, $path) = @_;  
    return (-e $path);
} 

sub directoryExist() {
    my ($class, $folderSource) = @_;  
    return (-d $folderSource);
} 

sub copyDirectory() {
    my ($class, $folderSource, $folderDest) = @_;  
    use File::Copy::Recursive qw(dircopy);
    dircopy($folderSource, $folderDest)
}      
1;
