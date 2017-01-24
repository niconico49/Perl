exports.jsdbstringconnectiion = {
    Records : [
    {
        ID_LANGUAGE_PROGRAMMING: "Java",
        DB_CONNECTION_FORMAT: "jdbc:filemaker://{@IP_SERVER}/{@DATABASE}?user={@LOGIN}&password={@PASSWORD}"
    },
    {
        ID_LANGUAGE_PROGRAMMING: ".Net",
        DB_CONNECTION_FORMAT: "Driver=FileMaker ODBC;Server={@IP_SERVER};Database={@DATABASE};UID={@LOGIN};PWD={@PASSWORD};UseLongVarchar=Yes"
    },
    {
        ID_LANGUAGE_PROGRAMMING: "PHP",
        DB_CONNECTION_FORMAT: "Driver=FileMaker ODBC;Server={@IP_SERVER};Database={@DATABASE};UID={@LOGIN};PWD={@PASSWORD};UseLongVarchar=Yes"
    },
    {
        ID_LANGUAGE_PROGRAMMING: "Python",
        DB_CONNECTION_FORMAT: "Driver=FileMaker ODBC;Server={@IP_SERVER};Database={@DATABASE};UID={@LOGIN};PWD={@PASSWORD};UseLongVarchar=Yes"
    },
    {
        ID_LANGUAGE_PROGRAMMING: "Perl",
        DB_CONNECTION_FORMAT: "dbi:ODBC:Driver=FileMaker ODBC;Server={@IP_SERVER};Database={@DATABASE};UID={@LOGIN};PWD={@PASSWORD};UseLongVarchar=Yes"
    },
    {
        ID_LANGUAGE_PROGRAMMING: "Cpp",
        DB_CONNECTION_FORMAT: "Driver=FileMaker ODBC;Server={@IP_SERVER};Database={@DATABASE};UID={@LOGIN};PWD={@PASSWORD};UseLongVarchar=Yes"
    },
    {
        ID_LANGUAGE_PROGRAMMING: "Ruby",
        DB_CONNECTION_FORMAT: "jdbc:filemaker://{@IP_SERVER}/{@DATABASE}?user={@LOGIN}&password={@PASSWORD}"
    }
    /*
    {
        ID_LANGUAGE_PROGRAMMING: "Ruby",
        DB_CONNECTION_FORMAT: "dbi:ODBC:Driver=FileMaker ODBC;Server={@IP_SERVER};Database={@DATABASE};UID={@LOGIN};PWD={@PASSWORD};UseLongVarchar=Yes"
    }
    */
    ]
}
