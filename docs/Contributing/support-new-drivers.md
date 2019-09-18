# Support new Drivers

> This page still under construction

If you plan to add a new driver to the project, we have a tool that can help you.

Steps:
- Checkout the project
  - `git clone https://github.com/mtxr/vscode-sqltools.git`
- Install all dependencies
  - `yarn`
- Use add drive tool to create initial files for you
  - `yarn run add-driver` or `yarn run add-driver --name "your driver name"`
  - This will create a lot of files inside the project. Change them as you need.
- Don't forget to add all existing features (if possible) to this new driver.
- After changing the files, test it and submit a PR to be reviewed.

If you need help, to hesitate to submit an issue with your doubts. I'll be glad to help!