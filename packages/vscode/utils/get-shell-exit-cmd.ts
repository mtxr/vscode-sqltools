import { env } from 'vscode';

export default async function getShellExitCommand(code = 0) {

  // env.shell in 1.71 sometimes returns '' unexpectedly.
  // Use a retry loop to try and overcome this.
  let shell = '';
  for (let attempt = 1; attempt <= 10; attempt++) {
    shell = env.shell;
    if (shell !== '') {
      break;
    }
    await new Promise(c => setTimeout(c, 500));
  }

  if (shell === '') {
    throw new Error('No env.shell retrieved despite retries');
  }

  const isPowerShell = shell.match(/[\\/]pwsh(\.exe)?$/g);
  if (isPowerShell) return `$(exit ${code})`;
  return `exit ${code}`;
}