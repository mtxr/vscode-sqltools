 Looking for maintainers => https://github.com/mtxr/vscode-sqltools/issues/896
------



<p style='text-align: center;'>
  <img src="https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/static/header-hero.svg?sanitize=true" />
</p>

<hr />

<p style='text-align: center;'>

[![Docs](https://img.shields.io/badge/docs-here-blueviolet?style=for-the-badge)](https://vscode-sqltools.mteixeira.dev)
[![ko-fi](https://user-images.githubusercontent.com/707561/112481485-d0d09800-8d55-11eb-8bfd-bb70c9984617.png)](https://ko-fi.com/Y8Y487W9)
[![Patreon](https://img.shields.io/badge/patreon-support-blue.svg?style=for-the-badge)](https://www.patreon.com/mteixeira)
[![Paypal Donate](https://img.shields.io/badge/paypal-donate-blue.svg?style=for-the-badge)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RSMB6DGK238V8)
[![VSCode.pro](https://img.shields.io/badge/Supported%20by-VSCode%20Power%20User%20Course%20%E2%86%92-gray.svg?colorA=655BE1&colorB=4F44D6&style=for-the-badge)](https://a.paddle.com/v2/click/16413/111711?link=1227)
[![GitHub](https://img.shields.io/github/license/mtxr/vscode-sqltools?style=for-the-badge)](https://github.com/mtxr/vscode-sqltools/blob/dev/LICENSE.md)

</p>

Database management done right. Connection explorer, query runner, intellisense, bookmarks, query history. Feel like a database hero!

You can read the entire docs in [https://vscode-sqltools.mteixeira.dev/](https://vscode-sqltools.mteixeira.dev/)

## Features

Some feature provided by SQLTools:

- Beautifier/Formatter
- Query runner, history and bookmarks
- Connection explorer
- Query generators (INSERT only)

Check out all the features and their documentation [here](http://vscode-sqltools.mteixeira.dev/#features).

## Supported Drivers

**Official Drivers**

|                                                                                                                           | Driver                     | Marketplace                                                                             | Package                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| ![AWS Redshift](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.pg/icons/redshift/default.png) | AWS Redshift               | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-pg)     | [packages/driver.pg](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.pg)         |
| ![CockroachDB](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.pg/icons/cockroach/default.png) | CockroachDB                | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-pg)     | [packages/driver.pg](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.pg)         |
| ![MariaDB](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.mysql/icons/mariadb/default.png)    | MariaDB                    | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)  | [packages/driver.mysql](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.mysql)   |
| ![MSSQL](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.mssql/icons/default.png)              | Microsoft SQL Server/Azure | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mssql)  | [packages/driver.mssql](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.mssql)   |
| ![MySQL](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.mysql/icons/default.png)              | MySQL                      | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)  | [packages/driver.mysql](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.mysql)   |
| ![PostgreSQL](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.pg/icons/pg/default.png)         | PostgreSQL                 | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-pg)     | [packages/driver.pg](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.pg)         |
| ![SQLite](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/packages/driver.sqlite/icons/default.png)            | SQLite                     | [Link](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-sqlite) | [packages/driver.sqlite](https://github.com/mtxr/vscode-sqltools/tree/dev/packages/driver.sqlite) |

> I'm looking for maintainers for each driver, if you are interested in maintaining/testing any driver, please contact me. https://mteixeira.dev

**Community Drivers:**

|                                                                                                                                           | Driver               | Marketplace                                                                                                            | Maintainer and Repository                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ![ClickHouse logo](https://raw.githubusercontent.com/ultram4rine/sqltools-clickhouse-driver/master/icons/default.png)                     | ClickHouse           | [Link](https://marketplace.visualstudio.com/items?itemName=ultram4rine.sqltools-clickhouse-driver)                     | [@ultram4rine](https://github.com/ultram4rine) <br/> [ultram4rine/sqltools-clickhouse-driver](https://github.com/ultram4rine/sqltools-clickhouse-driver)                                               |
| ![Google Cloud Spanner](https://raw.githubusercontent.com/cloudspannerecosystem/sqltools-cloud-spanner-driver/main/icons/default.png)     | Google Cloud Spanner | [Link](https://marketplace.visualstudio.com/items?itemName=google-cloud-spanner-ecosystem.google-cloud-spanner-driver) | [@cloudspannerecosystem](https://github.com/cloudspannerecosystem) <br/> [cloudspannerecosystem/sqltools-cloud-spanner-driver](https://github.com/cloudspannerecosystem/sqltools-cloud-spanner-driver) |
| ![InterSystems IRIS logo](https://raw.githubusercontent.com/intersystems-community/sqltools-intersystems-driver/master/icons/default.png) | InterSystems IRIS    | [Link](https://marketplace.visualstudio.com/items?itemName=intersystems-community.sqltools-intersystems-driver)        | [@daimor](https://github.com/daimor) <br/> [intersystems-community/sqltools-intersystems-driver](https://github.com/intersystems-community/sqltools-intersystems-driver)                               |
| ![SAP HANA](https://raw.githubusercontent.com/SAP/sap-hana-driver-for-sqltools/master/icons/default.png)                                  | SAP HANA             | [Link](https://marketplace.visualstudio.com/items?itemName=SAPOSS.sap-hana-driver-for-sqltools)                        | [@SAP](https://github.com/SAP) <br/> [SAP/sap-hana-driver-for-sqltools](https://github.com/SAP/sap-hana-driver-for-sqltools)                                                                           |
| ![Snowflake](https://raw.githubusercontent.com/koszti/sqltools-snowflake-driver/master/icons/default.png)                                 | Snowflake            | [Link](https://marketplace.visualstudio.com/items?itemName=koszti.snowflake-driver-for-sqltools)                       | [@koszti](https://github.com/koszti) <br/> [koszti/sqltools-snowflake-driver](https://github.com/koszti/sqltools-snowflake-driver)                                                                     |

Do you want to add a new driver? We have a tool to help you. See [support new drivers](https://vscode-sqltools.mteixeira.dev/contributing/support-new-drivers) guide.

**Drivers supported till v0.21.9:**

| Driver    | Maintainer                                       |
| --------- | ------------------------------------------------ |
| Cassandra | [@EpicEric](https://github.com/EpicEric)         |
| IBM DB2   | [@snyang](https://github.com/snyang)             |
| OracleDB  | [@mickeypearce](https://github.com/mickeypearce) |

> These drivers are being migrated to be compatible with v0.22 or newer. If you need one of them, you need to install v0.21.9.

#### Know Driver Issues

- Unable to connect with "Drivers XXXX is not installed"? Check [this issue](https://github.com/mtxr/vscode-sqltools/issues/590).

## Contributing

Please read the contributing guide [here](https://vscode-sqltools.mteixeira.dev/contributing).

Join all these amazing [contributors](https://github.com/mtxr/vscode-sqltools/graphs/contributors)❤️ on this journey.

## Donate and Support

SQLTools was developed with ♥ to save us time during our programming journey.

SQLTools will save you (for sure) a lot of time and help you to increase your productivity, so please consider a [donation](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RSMB6DGK238V8) or become a [supporter](https://www.patreon.com/mteixeira) and help SQLTools become more awesome than ever.

[![ko-fi](https://user-images.githubusercontent.com/707561/112481485-d0d09800-8d55-11eb-8bfd-bb70c9984617.png)](https://ko-fi.com/Y8Y487W9)
[![Patreon](https://img.shields.io/badge/patreon-support-blue.svg?style=for-the-badge&logo=patreon)](https://www.patreon.com/mteixeira)
[![Paypal Donate](https://img.shields.io/badge/paypal-donate-blue.svg?style=for-the-badge&logo=paypal)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RSMB6DGK238V8)

You can also fund specific issues via Issuehunt. That can boost the development of a feature you need and make it more attractive for contributors.

[![Issuehunt](https://raw.githubusercontent.com/mtxr/vscode-sqltools/dev/static/issuehunt-button.png)](https://issuehunt.io/r/mtxr/vscode-sqltools)

## Changelog

See changelog [here](https://vscode-sqltools.mteixeira.dev/changelog)

## Feedback

Please provide feedback through the [GitHub Issue](https://github.com/mtxr/vscode-sqltools/issues) system.
