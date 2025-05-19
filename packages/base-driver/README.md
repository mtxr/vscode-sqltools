# SQLTools Base Driver

This package is part of [vscode-sqltools](https://vscode-sqltools.mteixeira.dev/?umd_source=repository&utm_medium=readme&utm_campaign=base-driver) extension.

## Creating icon

PNG Images
Size: 64x64px
Default Icon: Opacity 100%, no margins and paddings
Active icon: Opacity 100%, no margins and paddings, green (#00FF00) circle 24x24 bottom right
Inactive icon: Opacity 50%, no margins and paddings

## Changelog

### v0.2.2

- createSshTunnel needs to be public rather than protected.

### v0.2.1

- Use @sqltools/types@0.2.0.

### v0.2.0

- Added SSH tunneling support.

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