sleep 120
echo "IMPORTING...."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -i /setup.sql
