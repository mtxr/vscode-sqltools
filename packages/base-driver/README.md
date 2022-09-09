# SQLTools Base Driver

This package is part of [vscode-sqltools](https://vscode-sqltools.mteixeira.dev/?umd_source=repository&utm_medium=readme&utm_campaign=base-driver) extension.

## Changelog

### v0.1.11

- Fix `toAbsolutePath` for Windows by using `vscode-uri`.

### v0.1.9

- Update log utility to use `@sqltools/log`.

### v0.1.8

- Using [resolve](https://www.npmjs.com/package/resolve) lib as resolver and exposed custom require and resolve functions.

### v0.1.7

- Fixes node require not working for dependencies.

### v0.1.6

- Fixes driver always asking for node runtime.

### v0.1.4

- Update @sqltool/types fixing `checkDependencies` being requred. It's optional

### v0.1.3

- Fix dynamic dependecy require issue.

### v0.1.2

First official release