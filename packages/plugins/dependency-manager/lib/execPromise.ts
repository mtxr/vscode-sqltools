import { spawn, SpawnOptions } from 'child_process';

function execPromise(
  command: string,
  args?: ReadonlyArray<string>,
  options: SpawnOptions = {}
) {
  return new Promise<{ message: string, stdout?: string; stderr?: string; code: number }>(
    (resolve, reject) => {
      options.env = {
        ...process.env,
        NODE_VERSION: process.versions.node,
        ...options.env,
      };
      const child = spawn(command, args, { cwd: __dirname, ...options });
      let stderr = '';
      let stdout = '';
      let output = '';

      child.stdout.on('data', chunk => {
        stdout += chunk.toString();
        output += chunk.toString();
        process.stdout.write(chunk);
      });
      child.stderr.on('data', chunk => {
        stderr += chunk.toString();
        output += chunk.toString();
        process.stderr.write(chunk);
      });

      child.on('exit', code => {
        if (code !== 0) {
          return reject({
            code,
            stderr,
            message: output
          });
        }
        return resolve({
          code,
          stdout,
          stderr,
          message: output,
        });
      });
    }
  );
}

export default execPromise;