# SQLTools PostgreSQL/Cockroach Driver

This package is part of [vscode-sqltools](https://vscode-sqltools.mteixeira.dev/?umd_source=repository&utm_medium=readme&utm_campaign=pg) extension.

## IAM database authentication

For PostgreSQL on Amazon RDS or Aurora, you can authenticate using IAM instead of a password:

1. In the connection form, set **Use password** to **IAM database authentication**.
2. Provide the **AWS Region** the Amazon RDS / Aurora instance is in.
3. Optionally provide an **AWS Profile** name from your shared AWS config (`~/.aws/credentials` / `~/.aws/config`). Leave empty to use the default credential provider chain (env vars, default profile, IMDS, SSO, etc.).
4. Enable SSL in **pgOptions > SSL** and supply the RDS CA bundle (download from [Using SSL/TLS to encrypt a connection to a DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html)). IAM database authentication requires SSL; it will not connect without it.
5. Make sure your database user is configured for IAM auth: `GRANT rds_iam TO <username>;`.

A fresh 15-minute auth token is signed for each new pool connection, so the pool keeps working past the token's expiry. See [IAM database authentication for MariaDB, MySQL, and PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html) for background.

## Changelog

### 0.5.8

- Add IAM database authentication support for Amazon RDS / Aurora.

### 0.5.7

- Support password connections over SSH.

### 0.5.6

- Support connections over SSH. [#1470](https://github.com/mtxr/vscode-sqltools/pull/1470) - thanks [@d-mato](https://github.com/d-mato)

### 0.5.5

- Use NodeJS 20.

### 0.5.4

- Use NodeJS 16.

### 0.5.3

- Fix problem connecting to AWS RDS postgresql. [#1265](https://github.com/mtxr/vscode-sqltools/pull/1265) - thanks [@jqknono](https://github.com/jqknono)

### 0.5.2

- List schemas in alphabetical order. [#1176](https://github.com/mtxr/vscode-sqltools/issues/1176) - thanks [@bombillazo](https://github.com/bombillazo)

### 0.5.1

- Use 0.27 extension's new ability to store connection passwords securely. [#1084](https://github.com/mtxr/vscode-sqltools/pull/1084)
- Avoid storing redundant properties on connections that use `connectString`. [#1087](https://github.com/mtxr/vscode-sqltools/issues/1087)

### 0.5.0

- Sync with 0.27 release of main extension.

### 0.4.0

- No longer promote as an official driver for Redshift. [#991](https://github.com/mtxr/vscode-sqltools/pull/991)
- Update Cockroach icons.

### 0.3.0

- Add Cockroach as an alias. Thanks [@ultram4rine](https://github.com/ultram4rine).
- Sync with 0.24 release of main extension.

### 0.2.0

- Fixes ssl issue. [#640](https://github.com/mtxr/vscode-sqltools/issues/640) [#675](https://github.com/mtxr/vscode-sqltools/issues/675)
- Update `base-driver` package.

### 0.1.0

- Sync official driver versions and technology

### 0.0.7

- Upgrade node package to `pg@8.x`.
- Added options for SSL connecitons.
- Fixes password as optional. [#621](https://github.com/mtxr/vscode-sqltools/issues/621)

### 0.0.4

- Fixes drivers not showing data type on explorer. [#595](https://github.com/mtxr/vscode-sqltools/issues/595)

### 0.0.3

- First working version
