# Plugins

## Creating a plugin

This file still need a deeper guide.

Every plugin should be contained by its folder within this repository:
```
packages/plugins
...
└── example
    ├── extension.ts
    └── language-server.ts
```

To keep it short, basically we have 2 files:
- extension.ts
  > This file should register everything extension needs.
  > Commands, explorer, webviews, language client request. Language server requests are handled by language-server.ts file.
- language-server.ts
  > This file should register everything we need to do async.
  > Long requests, query manipulation, server connection e etc.

