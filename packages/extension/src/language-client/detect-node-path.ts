import { getDataPath } from "@sqltools/util/path";
import { window } from 'vscode';
import fs from "fs";
import getShellExitCommand from "@sqltools/vscode/utils/get-shell-exit-cmd";

const nodeRuntimeTmpFile = getDataPath(".node-runtime");


const detectNodePath = async (): Promise<string | null> => {
  try {
    const terminal = window.createTerminal({ name: "detect node runtime" });
    const shellExitCommand = await getShellExitCommand();
    await new Promise<void>(async (resolve) => {
      window.onDidCloseTerminal((e => e.processId === terminal.processId && resolve()));
      const nodeCmd = `require("fs").writeFileSync("${nodeRuntimeTmpFile}", process.execPath)`;
      const nodeCmdWindows = nodeCmd.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');
      terminal.sendText(`node -e '${process.platform === 'win32' ? nodeCmdWindows : nodeCmd}'; ${shellExitCommand}`);
    })
    return fs.readFileSync(nodeRuntimeTmpFile).toString();
  } catch (error) {
    return null
  }
}

export default detectNodePath;
