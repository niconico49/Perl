set THIS_DIR=%~dp0
set LAUNCHER="%THIS_DIR%EasySendMail.pl"
set PERL5LIB=%THIS_DIR%..\EasyLibrary
set PERL_BIN="%THIS_DIR%..\..\..\Runtime\Perl\Perl\bin\perl"
%PERL_BIN% %LAUNCHER%
pause
