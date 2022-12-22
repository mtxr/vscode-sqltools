import { authentication } from 'vscode';
import { IExtensionPlugin, IExtension } from '@sqltools/types';
import Context from '@sqltools/vscode/context';
import { SQLToolsAuthenticationProvider } from './authenticationProvider';

export default class AuthenticationProviderPlugin implements IExtensionPlugin {
  public readonly name = 'Authentication Provider Plugin';
  private isRegistered = false;

  public register(_extension: IExtension) {
    if (this.isRegistered) {
      return; // do not register twice
    }

    // Register our authentication provider. NOTE: this will register the provider globally which means that
    // any other extension can request to use use this provider via the `vscode.authentication.getSession` API.
    Context.subscriptions.push(authentication.registerAuthenticationProvider(
      SQLToolsAuthenticationProvider.id,
      SQLToolsAuthenticationProvider.label,
      new SQLToolsAuthenticationProvider(Context.secrets, Context.globalState),
      { supportsMultipleAccounts: true },
    ));

    this.isRegistered = true;
  }
}
