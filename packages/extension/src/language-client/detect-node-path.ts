import { getDataPath } from "@sqltools/util/path";
import { window } from 'vscode';
import fs from "fs";

const nodeRuntimeTmpFile = getDataPath(".node-runtime");


const detectNodePath = async (): Promise<string | null> => {
  try {
    const terminal = window.createTerminal({ name: "detect node runtime" });
    await new Promise<void>((resolve) => {
      window.onDidCloseTerminal((e => e.processId === terminal.processId && resolve()))
      terminal.sendText(`node -e 'require("fs").writeFileSync("${nodeRuntimeTmpFile}", process.execPath)'; exit`);
    })
    return fs.readFileSync(nodeRuntimeTmpFile).toString();
  } catch (error) {
    return null
  }
}

export default detectNodePath;
