[1m[0m[1m─────────────────────────────────────────────────────────────────────────────────────────
[1mmodified: packages/core/utils/telemetry.ts
[1m─────────────────────────────────────────────────────────────────────────────────────────
[36m@ packages/core/utils/telemetry.ts:140 @[1m[38;5;146m export class Telemetry implements SQLTools.TelemetryInterface {[0m
    message: string,[m
    value: string = 'Dismissed'[m
  ): void {[m
[1m[38;5;1m[1;31m    console.[m[1;31;48;5;52mdebu[m[1;31mg(`Message: ${message}`);[m
[0m[1m[38;5;2m[1;32m    console.[m[1;32;48;5;22mlo[m[1;32mg(`Message: ${message}`);[m
[0m    this.client.trackTrace({ message: this.prefixed(message), severity, properties: { value } });[m
  }[m
[m
[36m@ packages/core/utils/telemetry.ts:149 @[1m[38;5;146m export class Telemetry implements SQLTools.TelemetryInterface {[0m
    name: string,[m
    properties?: { [key: string]: string }[m
  ): void {[m
[1m[38;5;1m[1;31m    console.[m[1;31;48;5;52mdebu[m[1;31mg(`Event: ${name}`, properties || '');[m
[0m[1m[38;5;2m[1;32m    console.[m[1;32;48;5;22mlo[m[1;32mg(`Event: ${name}`, properties || '');[m
[0m    this.client.trackEvent({ name: this.prefixed(name), properties });[m
  }[m
[m
[1m[0m[1m─────────────────────────────────────────────────────────────────────────────────────────
[1mmodified: packages/extension/index.ts
[1m─────────────────────────────────────────────────────────────────────────────────────────
[36m@ packages/extension/index.ts:188 @[1m[38;5;146m export class SQLToolsExtension implements SQLTools.ExtensionInterface {[0m
    if (!evt.command) return;[m
    if (!this.willRunCommandHooks[evt.command] || this.willRunCommandHooks[evt.command].length === 0) return;[m
[m
[1m[38;5;1m[1;31m    console.[m[1;31;48;5;52mdebu[m[1;31mg(`Will run ${this.willRunCommandHooks[evt.command].length} attached handler for 'beforeCommandHooks'`)[m
[0m[1m[38;5;2m[1;32m    console.[m[1;32;48;5;22mlo[m[1;32mg(`Will run ${this.willRunCommandHooks[evt.command].length} attached handler for 'beforeCommandHooks'`)[m
[0m    this.willRunCommandHooks[evt.command].forEach(hook => hook(evt));[m
  }[m
  private onDidRunCommandSuccessfullyHandler = (evt: SQLTools.CommandSuccessEvent): void => {[m
    if (!evt.command) return;[m
    if (!this.didRunCommandSuccessfullyHooks[evt.command] || this.didRunCommandSuccessfullyHooks[evt.command].length === 0) return;[m
[m
[1m[38;5;1m[1;31m    console.[m[1;31;48;5;52mdebu[m[1;31mg(`Will run ${this.didRunCommandSuccessfullyHooks[evt.command].length} attached handler for 'afterCommandSuccessfullyHooks'`)[m
[0m[1m[38;5;2m[1;32m    console.[m[1;32;48;5;22mlo[m[1;32mg(`Will run ${this.didRunCommandSuccessfullyHooks[evt.command].length} attached handler for 'afterCommandSuccessfullyHooks'`)[m
[0m    this.didRunCommandSuccessfullyHooks[evt.command].forEach(hook => hook(evt));[m
  }[m
[m
[1m[0m[1m─────────────────────────────────────────────────────────────────────────────────────────
[1mmodified: packages/extension/patch-console.ts
[1m─────────────────────────────────────────────────────────────────────────────────────────
[36m@ packages/extension/patch-console.ts:51 @[1m[38;5;146m class OutputChannelLogger implements Console {[0m
    patchedConsole.log(this.prefix('DEBUG'), message, ...data);[m
  }[m
  debug = (message: string, ...data: any[]) => {[m
[1m[38;5;1m[1;31m    patchedConsole.[m[1;31;48;5;52mdebu[m[1;31mg(this.prefix('DEBUG'), message, ...data);[m
[0m[1m[38;5;2m[1;32m    patchedConsole.[m[1;32;48;5;22mlo[m[1;32mg(this.prefix('DEBUG'), message, ...data);[m
[0m  }[m
  error = (message: string, ...data: any[]) => {[m
    patchedConsole.error(this.prefix('ERROR'), message, ...data);[m
[1m[0m[1m─────────────────────────────────────────────────────────────────────────────────────────
[1mmodified: packages/plugins/dependency-manager/language-server.ts
[1m─────────────────────────────────────────────────────────────────────────────────────────
[36m@ packages/plugins/dependency-manager/language-server.ts:75 @[1m[38;5;146m export default class DependencyManager implements SQLTools.LanguageServerPlugin[0m
    }[m
    DependencyManager.runningJobs.push(dialect);[m
[m
[1m[38;5;1m[1;31m    console.[m[1;31;48;5;52mdebu[m[1;31mg('Received request to install deps:', JSON.stringify(deps));[m
[0m[1m[38;5;2m[1;32m    console.[m[1;32;48;5;22mlo[m[1;32mg('Received request to install deps:', JSON.stringify(deps));[m
[0m    try {[m
      for (let dep of deps) {[m
        switch(dep.type) {[m
          case 'npmscript':[m
[1m[38;5;1m[1;31m            console.[m[1;31;48;5;52mdebu[m[1;31mg(`Will run ${dep.name} script`);[m
[0m[1m[38;5;2m[1;32m            console.[m[1;32;48;5;22mlo[m[1;32mg(`Will run ${dep.name} script`);[m
[0m            await this.runNpmScript(dep.name, { env: dep.env });[m
[1m[38;5;1m[1;31m            console.[m[1;31;48;5;52mdebu[m[1;31mg(`Finished ${dep.name} script`);[m
[0m[1m[38;5;2m[1;32m            console.[m[1;32;48;5;22mlo[m[1;32mg(`Finished ${dep.name} script`);[m
[0m            break;[m
          case 'package':[m
[1m[38;5;1m[1;31m            console.[m[1;31;48;5;52mdebu[m[1;31mg(`Will install ${dep.name} package`, dep.args || '');[m
[0m[1m[38;5;2m[1;32m            console.[m[1;32;48;5;22mlo[m[1;32mg(`Will install ${dep.name} package`, dep.args || '');[m
[0m            const args = [`${dep.name}${dep.version ? `@${dep.version}` : ''}`].concat(dep.args || [])[m
            await this.install(args, { env: dep.env });[m
[1m[38;5;1m[1;31m            console.[m[1;31;48;5;52mdebu[m[1;31mg(`Finished ${dep.name} script`);[m
[0m[1m[38;5;2m[1;32m            console.[m[1;32;48;5;22mlo[m[1;32mg(`Finished ${dep.name} script`);[m
[0m            break;[m
        }[m
      }[m
[1m[38;5;1m[1;31m      console.[m[1;31;48;5;52mdebu[m[1;31mg('Finished installing deps');[m
[0m[1m[38;5;2m[1;32m      console.[m[1;32;48;5;22mlo[m[1;32mg('Finished installing deps');[m
[0m      DependencyManager.runningJobs = DependencyManager.runningJobs.filter(v => v !== dialect);[m
    } catch(e) {[m
      DependencyManager.runningJobs = DependencyManager.runningJobs.filter(v => v !== dialect);[m
