<!-- HEADER START -->
<p style='text-align: center;'>
  <img src="https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/static/header-hero.png" />
</p>

<hr />
<!-- HEADER END -->

<p style='text-align: center;'>

[![GitHub](https://img.shields.io/github/license/mtxr/vscode-sqltools?style=for-the-badge)](https://github.com/mtxr/vscode-sqltools/blob/dev/LICENSE.md)

</p>

Welcome to Database Management done right.
SQLTools provides connections to many of the most commonly used databases, making it easier to work with your data. With this tool, developers will save (a lot of) time, increase productivity and feel like a database hero ✌️

SQLTools is an open-source project maintained by [Matheus Teixeira](https://mteixeira.dev/) and [George James Software](https://georgejames.com), alongside contributions from our brilliant community of users.

If you like using this tool please [leave us a review](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools&ssr=false#review-details).

## Features

Connects to MySQL, PostgreSQL, Microsoft SQL Server and many more...

- Beautifier and formatter for SQL code
- Query runner, history and bookmarks
- Connection explorer
- Generator for INSERT queries
- Pluggable driver architecture

Find out more in the documentation [here](http://vscode-sqltools.mteixeira.dev/#features).

## Getting Started

SQLTools is a set of VS Code extensions that connect to, query, and display results from a SQL database manager.
(Supported databases are listed below.)

The installation process is straightforward:

- Open VS Code
- Click the Extensions view (in the left bar), then search for `@tag:sqltools-driver`.
  This lists all the drivers available for SQLTools.
- Install the driver for your database. This also installs the core SQLTools extension.
- Click the SQLTools icon (in the left bar)
- Create a _connection_ to your database. To do this, hover over **CONNECTIONS** in the SQLTools pane. Click the "Add New Connection" icon and choose the driver and enter the connection parameters.

You can then open and query it from within VS Code.

## Supported Databases

To use SQLTools you will also need to install the appropriate driver extension for your database.

If the driver you want is not available, you can use our handy [new drivers guide](https://vscode-sqltools.mteixeira.dev/en/contributing/support-new-drivers/) to write it yourself (and help our community in the process) or submit feedback via [GitHub](https://github.com/mtxr/vscode-sqltools/issues).

If you need a driver sooner, get in touch with the maintainers directly – we might be able to help you out.

Psst… we’re always on the lookout for maintainers for the official drivers, so let us know if this is something you’re interested in!

**Official Drivers**

|                                                                                                                           | Driver                     | Marketplace                                                                             | Package                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| ![CockroachDB](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.pg/icons/cockroach/default.png) | CockroachDB                | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-pg)     | [packages/driver.pg](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.pg)         |
| ![MariaDB](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.mysql/icons/mariadb/default.png)    | MariaDB                    | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)  | [packages/driver.mysql](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.mysql)   |
| ![MSSQL](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.mssql/icons/default.png)              | Microsoft SQL Server/Azure | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mssql)  | [packages/driver.mssql](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.mssql)   |
| ![MySQL](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.mysql/icons/default.png)              | MySQL                      | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)  | [packages/driver.mysql](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.mysql)   |
| ![TiDB](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.mysql/icons/tidb/default.png)          | TiDB                       | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)  | [packages/driver.mysql](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.mysql)   |
| ![PostgreSQL](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.pg/icons/pg/default.png)         | PostgreSQL                 | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-pg)     | [packages/driver.pg](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.pg)         |
| ![SQLite](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.sqlite/icons/default.png)            | SQLite                     | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-sqlite) | [packages/driver.sqlite](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.sqlite) |

**Community Drivers:**

|                                                                                                                                           | Driver                          | Marketplace                                                                                                            | Maintainer and Repository                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![AWS Redshift](https://raw.githubusercontent.com/kj-9/sqltools-redshift-driver/main/icons/default.png)                                   | AWS Redshift                    | [Link](https://marketplace.visualstudio.com/items?itemName=kj.sqltools-driver-redshift)                                | [@kj-9](https://github.com/kj-9)<br/> [kj-9/sqltools-redshift-driver](https://github.com/kj-9/sqltools-redshift-driver)                                                                                  |
| ![ClickHouse logo](https://raw.githubusercontent.com/ultram4rine/sqltools-clickhouse-driver/master/icons/default.png)                     | ClickHouse                      | [Link](https://marketplace.visualstudio.com/items?itemName=ultram4rine.sqltools-clickhouse-driver)                     | [@ultram4rine](https://github.com/ultram4rine) <br/> [ultram4rine/sqltools-clickhouse-driver](https://github.com/ultram4rine/sqltools-clickhouse-driver)                                                 |
| ![Databricks](https://raw.githubusercontent.com/databricks/sqltools-databricks-driver/main/icons/default.png)                             | Databricks                      | [Link](https://marketplace.visualstudio.com/items?itemName=databricks.sqltools-databricks-driver)                      | [@Databricks](https://github.com/databricks) <br/> [databricks/sqltools-databricks-driver](https://github.com/databricks/sqltools-databricks-driver)                                                     |
| ![Db2](https://raw.githubusercontent.com/lucashancock/db2-sqltools/master/icons/default.png)                                              | Db2                             | [Link](https://marketplace.visualstudio.com/items?itemName=lucashancock.db2-sqltools)                                  | [@lucashancock](https://github.com/lucashancock) <br/> [lucashancock/db2-sqltools](https://github.com/lucashancock/db2-sqltools)                                                                         |
| ![DolphinDB](https://raw.githubusercontent.com/dolphindb/sqltools-dolphindb-driver/main/icons/default.png)                                 | DolphinDB                         | [Link](https://marketplace.visualstudio.com/items?itemName=dolphindb.dolphindb-vscode)                   | [@DolphinDB](https://github.com/dolphindb) <br/> [dolphindb/sqltools-dolphindb-driver](https://github.com/dolphindb/sqltools-dolphindb-driver)                                                                       |
| ![DuckDB Sql Tools](https://raw.githubusercontent.com/RandomFractals/duckdb-sql-tools/main/docs/images/duckdb.png)                        | DuckDB                          | [Link](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.duckdb-sql-tools)                         | [@RandomFractals](https://github.com/RandomFractals) <br/> [RandomFractals/duckdb-sql-tools](https://github.com/RandomFractals/duckdb-sql-tools)                                                         |
| ![DuckDB Pro Tools](https://raw.githubusercontent.com/RandomFractals/duckdb-sql-tools/main/docs/images/duckdb-pro.png)                    | DuckDB Pro                      | [Sign up](https://github.com/sponsors/RandomFractals/sponsorships?tier_id=18884)                                       | [@RandomFractals](https://github.com/RandomFractals) <br/> [RandomFractals/pro-data-tools#duckdb-pro-tools](https://github.com/RandomFractals/pro-data-tools/blob/main/duckdb-tools.md#duckdb-pro-tools) |
| ![DuckDB (Latest Version Support)](https://raw.githubusercontent.com/evidence-dev/sqltools-duckdb-driver/master/icons/default.png)        | DuckDB (Latest Version Support) | [Link](https://marketplace.visualstudio.com/items?itemName=Evidence.sqltools-duckdb-driver)                            | [@Evidence](https://github.com/evidence-dev/evidence) <br/> [evidence-dev/sqltools-duckdb-driver](https://github.com/evidence-dev/sqltools-duckdb-driver)                                                |
| ![Google BigQuery](https://raw.githubusercontent.com/evidence-dev/sqltools-bigquery-driver/master/icons/default.png)                      | Google BigQuery                 | [Link](https://marketplace.visualstudio.com/items?itemName=Evidence.sqltools-bigquery-driver)                          | [@Evidence](https://github.com/evidence-dev/evidence) <br/> [evidence-dev/sqltools-bigquery-driver](https://github.com/evidence-dev/sqltools-bigquery-driver)                                            |
| ![Google Cloud Spanner](https://raw.githubusercontent.com/cloudspannerecosystem/sqltools-cloud-spanner-driver/main/icons/default.png)     | Google Cloud Spanner            | [Link](https://marketplace.visualstudio.com/items?itemName=google-cloud-spanner-ecosystem.google-cloud-spanner-driver) | [@cloudspannerecosystem](https://github.com/cloudspannerecosystem) <br/> [cloudspannerecosystem/sqltools-cloud-spanner-driver](https://github.com/cloudspannerecosystem/sqltools-cloud-spanner-driver)   |
| ![Google Cloud SQL (PostgreSQL)](https://raw.githubusercontent.com/curioswitch/sqltools-cloudsql-pg/main/icons/pg/default.png)            | Google Cloud SQL (PostgreSQL)   | [Link](https://marketplace.visualstudio.com/items?itemName=curioswitch.sqltools-driver-cloudsql-pg)                    | [@curioswitch](https://github.com/curioswitch) <br/> [curioswitch/sqltools-cloudsql-pg](https://github.com/curioswitch/sqltools-cloudsql-pg)                                                             |
| ![Hive](https://raw.githubusercontent.com/datafe/sqltools-hive-vscode-extension/main/icon-small.png)                                      | Hive                            | [Link](https://marketplace.visualstudio.com/items?itemName=dataworks.sqltools-driver-hive)                             | [@datafe](https://github.com/datafe) <br/> [datafe/sqltools-hive-driver](https://github.com/datafe/sqltools-hive-vscode-extension)                                                                       |
| ![Hologres](https://raw.githubusercontent.com/datafe/sqltools-hologres-vscode-extension/main/icon-small.png)                              | Hologres                        | [Link](https://marketplace.visualstudio.com/items?itemName=dataworks.sqltools-driver-hologres)                         | [@datafe](https://github.com/datafe) <br/> [datafe/sqltools-hologres-driver](https://github.com/datafe/sqltools-hologres-vscode-extension)                                                               |
| ![InterSystems IRIS logo](https://raw.githubusercontent.com/intersystems-community/sqltools-intersystems-driver/master/icons/default.png) | InterSystems IRIS               | [Link](https://marketplace.visualstudio.com/items?itemName=intersystems-community.sqltools-intersystems-driver)        | [@daimor](https://github.com/daimor) <br/> [intersystems-community/sqltools-intersystems-driver](https://github.com/intersystems-community/sqltools-intersystems-driver)                                 |
| ![MaxCompute](https://raw.githubusercontent.com/datafe/sqltools-maxcompute-vscode-extension/main/icon-small.png)                          | MaxCompute                      | [Link](https://marketplace.visualstudio.com/items?itemName=dataworks.sqltools-driver-maxcompute)                       | [@datafe](https://github.com/datafe) <br/> [datafe/sqltools-maxcompute-driver](https://github.com/datafe/sqltools-maxcompute-vscode-extension)                                                           |
| ![Oracle](https://raw.githubusercontent.com/hashhashu/sqltools-Oracle-driver/master/icons/default.png)                                    | Oracle                          | [Link](https://marketplace.visualstudio.com/items?itemName=hurly.sqltools-oracle-driver)                               | [@hashhashu](https://github.com/hashhashu) <br/> [hashhashu/sqltools-Oracle-driver](https://github.com/hashhashu/sqltools-Oracle-driver)                                                                 |
| ![SAP HANA](https://raw.githubusercontent.com/SAP/sap-hana-driver-for-sqltools/master/icons/default.png)                                  | SAP HANA                        | [Link](https://marketplace.visualstudio.com/items?itemName=SAPOSS.sap-hana-driver-for-sqltools)                        | [@SAP](https://github.com/SAP) <br/> [SAP/sap-hana-driver-for-sqltools](https://github.com/SAP/sap-hana-driver-for-sqltools)                                                                             |
| ![SingleStore](https://github.com/singlestore-labs/sqltools-singlestore-driver/blob/main/icons/default.png)                               | SingleStore                     | [Link](https://marketplace.visualstudio.com/items?itemName=singlestore.sqltools-singlestore-driver)                    | [@singlestore-labs](https://github.com/singlestore-labs) <br/> [singlestore-labs/sqltools-singlestore-driver](https://github.com/singlestore-labs/sqltools-singlestore-driver)                           |
| ![Snowflake](https://raw.githubusercontent.com/koszti/sqltools-snowflake-driver/master/icons/default.png)                                 | Snowflake                       | [Link](https://marketplace.visualstudio.com/items?itemName=koszti.snowflake-driver-for-sqltools)                       | [@koszti](https://github.com/koszti) <br/> [koszti/sqltools-snowflake-driver](https://github.com/koszti/sqltools-snowflake-driver)                                                                       |
| ![SQLite Pro Tools](https://raw.githubusercontent.com/RandomFractals/pro-data-tools/main/docs/images/sqlite-pro-tools.png)                | SQLite Pro                      | [Sign up](https://github.com/sponsors/RandomFractals/sponsorships?tier_id=18884)                                       | [@RandomFractals](https://github.com/RandomFractals) <br/> [RandomFractals/pro-data-tools/sqlite-tools](https://github.com/RandomFractals/pro-data-tools/blob/main/sqlite-tools.md)                      |
| ![Teradata](https://raw.githubusercontent.com/scriptpup/sqltools-teradata-driver/master/icons/default.png)                                | Teradata                        | [Link](https://marketplace.visualstudio.com/items?itemName=scriptpup.sqltools-teradata-driver)                         | [@ScriptPup](https://github.com/ScriptPup) <br/> [ScriptPup/sqltools-teradata-driver](https://github.com/ScriptPup/sqltools-teradata-driver)                                                             |
| ![Trino](https://raw.githubusercontent.com/regadas/sqltools-trino-driver/master/icons/default.png)                                        | Trino                           | [Link](https://marketplace.visualstudio.com/items?itemName=regadas.sqltools-trino-driver)                              | [@regadas](https://github.com/regadas) <br/> [regadas/sqltools-trino-driver](https://github.com/regadas/sqltools-trino-driver)                                                                           |
| ![Vertica](https://raw.githubusercontent.com/vertica/sqltools-vertica-driver/main/vertica-logo-small.png)                                 | Vertica                         | [Link](https://marketplace.visualstudio.com/items?itemName=vertica-official.sqltools-vertica-driver)                   | [@vertica](https://github.com/vertica) <br/> [vertica/sqltools-vertica-driver](https://github.com/vertica/sqltools-vertica-driver)                                                                       |

**Related Tools**

|                                                                                                                                    | Name                   | Download                                                                          | Repository                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ![Markdown SQL Pro Tools](https://raw.githubusercontent.com/RandomFractals/pro-data-tools/main/docs/images/markdown-sql-tools.png) | Markdown SQL Pro Tools | [Sign up](https://github.com/sponsors/RandomFractals/sponsorships?tier_id=295482) | [RandomFractals/pro-data-tools#markdown-sql-pro-tools](https://github.com/RandomFractals/pro-data-tools#markdown-sql-pro-tools) |
| ![PRQL Pro Tools](https://raw.githubusercontent.com/RandomFractals/pro-data-tools/main/docs/images/prql-pro-tools.png)             | PRQL Pro Tools         | [Sign up](https://github.com/sponsors/RandomFractals/sponsorships?tier_id=18884)  | [RandomFractals/pro-data-tools#prql-pro-tools](https://github.com/RandomFractals/pro-data-tools#prql-pro-tools)                 |

## Contributing

We are grateful to our [contributors](https://github.com/mtxr/vscode-sqltools/graphs/contributors) for helping with this project ❤️ If you would like to join them you’ll find everything you need to know about contributing [here](https://vscode-sqltools.mteixeira.dev/contributing).

## Changelog

See the changelog [here](https://vscode-sqltools.mteixeira.dev/changelog).

## Feedback

Our aim is to build a tool that is genuinely helpful for developers. Therefore we welcome any feedback or additional feature requests – please submit them through the [GitHub Issue](https://github.com/mtxr/vscode-sqltools/issues) system.

If you need help sooner, get in touch with the maintainers directly – we might be able to help you out.

## About George James Software

George James Software has been providing innovative software solutions for over 35 years. We pride ourselves on the quality and maintainability of our code and we have built a number of tools to help developers achieve the same with their work. These are available as VS Code extensions [here](https://marketplace.visualstudio.com/publishers/georgejames).

We also help other developers to build their own extensions. If there is a tool you need building please get in touch with us at [info@georgejames.com](mailto:info@georgejames.com).
