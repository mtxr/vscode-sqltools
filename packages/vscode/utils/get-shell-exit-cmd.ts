import { env } from 'vscode';

export default function getShellExitCommand(code = 0) {
  const isPowerShell = env.shell.match(/[\\/]pwsh(\.exe)?$/g);
  if (isPowerShell) return `$(exit ${code})`;
  return `exit ${code}`;
}