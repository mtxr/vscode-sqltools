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

  if (shell.match(/[\\/]pwsh(\.exe)?$/g)) {

    // PowerShell 7+ supports the && pipeline chain operator but needs the exit command wrapped
    return `&& $(exit ${code})`;
  } else if (shell.match(/[\\]powershell.exe$/g)) {

    // Bundled PowerShell of a Windows workstation where PowerShell 7+ hasn't been installed doesn't support the && pipeline chain operator,
    // so use ; followed by a conditional command
    return `; if ($?) { exit ${code} }`;
  } else {

    // Everything else
    return `&& exit ${code}`;
  }
}
