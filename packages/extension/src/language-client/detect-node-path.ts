import { getDataPath } from "@sqltools/util/path";
import { commands, window } from 'vscode';
import fs from "fs";
import getShellExitCommand from "@sqltools/vscode/utils/get-shell-exit-cmd";

const nodeRuntimeTmpFile = getDataPath(".node-runtime");


const detectNodePath = async (): Promise<string | null> => {
  const failureMessageTimer = setTimeout(() => {
    window.showWarningMessage("Check Terminal view for an erroring 'detect node runtime' session. Capture details for investigation, then kill the terminal to continue SQLTools extension startup. Change the 'sqltools.detectNodeRuntime' setting to disable runtime detection.",
      { modal: true });
      commands.executeCommand("terminal.focus");
  }, 15_000);
  try {
    const terminal = window.createTerminal({ name: "detect node runtime" });
    const shellExitCommand = await getShellExitCommand();
    await new Promise<void>(async (resolve) => {
      window.onDidCloseTerminal((e => e.processId === terminal.processId && resolve()));
      const nodeCmd = `require("fs").writeFileSync("${nodeRuntimeTmpFile}", process.execPath)`;
      const nodeCmdWindows = nodeCmd.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');
      terminal.sendText(`node -e '${process.platform === 'win32' ? nodeCmdWindows : nodeCmd}' ${shellExitCommand}`);
    })
    return fs.readFileSync(nodeRuntimeTmpFile).toString();
  } catch (error) {
    return null
  } finally {
    clearTimeout(failureMessageTimer);
  }
}

export default detectNodePath;
