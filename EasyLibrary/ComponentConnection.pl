use DateTime::Format::ISO8601;
use DBI;

package ComponentConnection;

sub getInstanceFactory() {
    my $class = shift;
    my $self = {
      _connection => undef, 
      _statement => undef, 
      _row => undef 
    };
    bless $self, $class;
    return $self;   
}

sub getInstance() {
  return ComponentConnection->getInstanceFactory();
}

sub open() {
    my ($class, $connectionString) = @_;
    $class->{_connection} = DBI->connect($connectionString);
}

sub bindParameter() {
    my ($class, $i, $value) = @_;
    $class->{_statement}->bind_param($i + 1, $value);
}

sub prepareStatement() {
    my ($class, $sql) = @_;
    $class->{_statement} = $class->{_connection}->prepare($sql);
}

sub executeQuery() {
    my ($class) = @_;

    $isEexecuted = $class->{_statement}->execute();
    $class->{_statement}->{LongTruncOk} = 1;
}

sub executeNonQuery() {
    my ($class) = @_;

    $rowCount = -1;

    $isEexecuted = $class->{_statement}->execute();
    $class->{_statement}->{LongTruncOk} = 1;

    $rowCount = $class->{_statement}->rows; 
    #$statement = $class->execute($sql, $componentList);
    #$rowCount = $statement->rows; 
    return $rowCount;
}

sub close() {
    my ($class) = @_;

    if ($class->{_statement}) {
      $class->{_statement}->finish();
    }
    $class->{_connection}->disconnect();
}

sub isBof() {
    my ($class) = @_;
    $value = $this->rowCounter = 0; 
    return $value;
}

sub isEof() {
    my ($class) = @_;
    $value = $this->rowCounter + 1 <= $this->recordCount; 
    return $value; 
}

sub moveNext() {
    my ($class) = @_;
    
    my $result = 1;
    
    $class->{_row} = $class->{_statement}->fetchrow_arrayref;
    
    if (!$class->{_row}) {
      $result = 0;
    }

    return $result; 
}

sub columnCount() {
    my ($class) = @_;
    
    return $class->{_statement}->{NUM_OF_FIELDS};
}

sub columnName() {
    my ($class, $i) = @_;
    
    return $class->{_statement}->{NAME}->[$i];
}

sub columnType() {
    my ($class, $i) = @_;

    my $columnType = $class->{_statement}->{TYPE}->[$i]; 
    return $class->columnTypeString($columnType);
    #return $class->{_statement}->{TYPE}->[$i];
}

sub columnValue() {
    my ($class, $i) = @_;

    my $fieldName = $class->columnName($i);
    my $value = $class->{_row}[$i];;
    
    $value = "" unless $value;

    if ($value ne "") {
        my $columnType = $class->columnType($i);

        if ($columnType == 93) {
            #TIMESTAMP
            $value = DateTime::Format::ISO8601->parse_datetime($value);
        }
        elsif ($columnType == 91) {
            #DATE
            $value = DateTime::Format::ISO8601->parse_datetime($value);
        }
        elsif ($columnType == 92) {
            #TIME
            $value = DateTime::Format::ISO8601->parse_time($value);
        }
    }

    return $value;
     
}

sub columnTypeString() {
    my ($class, $columnType) = @_;

    my $result = "String";
    
    if ($columnType >= 2
        &&
        $columnType <= 8
    ) {
      $result = "Double";
    }
    elsif($columnType == 9
        ||
        $columnType == 91
    ) {
      $result = "Date";
    }
    elsif($columnType == 10
        ||
        $columnType == 92
    ) {
      $result = "Time";
    }
    elsif($columnType == 11
        ||
        $columnType == 93
    ) {
      $result = "DateTime";
    }
     
    return $result;
}

=start
SQL_CHAR             1
SQL_NUMERIC          2
SQL_DECIMAL          3
SQL_INTEGER          4
SQL_SMALLINT         5
SQL_FLOAT            6
SQL_REAL             7
SQL_DOUBLE           8
SQL_DATE             9
SQL_TIME            10
SQL_TIMESTAMP       11
SQL_VARCHAR         12
SQL_LONGVARCHAR     -1
SQL_BINARY          -2
SQL_VARBINARY       -3
SQL_LONGVARBINARY   -4
SQL_BIGINT          -5
SQL_TINYINT         -6
SQL_BIT             -7
SQL_WCHAR           -8
SQL_WVARCHAR        -9
SQL_WLONGVARCHAR   -10
SQL_TYPE_DATE (91)
SQL_TYPE_TIME (92)
SQL_TYPE_TIMESTAMP (93)
=cut

1;
