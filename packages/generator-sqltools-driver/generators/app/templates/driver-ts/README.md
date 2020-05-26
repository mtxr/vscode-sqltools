# SQLTools <%= name %> Driver

## Creating icon

PNG Images
Size: 64x64px
Default Icon: Opacity 100%, no margins and paddings
Active icon: Opacity 100%, no margins and paddings, green (#00FF00) circle 24x24 bottom right
Inactive icon: Opacity 50%, no margins and paddings

## Creating connectino schema for the assistant

We are using `@rjsf/core` to render the forms, so in order to add you driver to the connection assistant,
edit `connection.schema.json` and `ui.schema.json`.

See https://react-jsonschema-form.readthedocs.io/en/latest/ for more instructions.

## Publish the driver

See https://code.visualstudio.com/api/working-with-extensions/publishing-extension