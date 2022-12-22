import { AuthenticationSession, AuthenticationSessionAccountInformation } from "vscode";
import { SQLToolsAuthenticationProvider } from "./authenticationProvider";

export class SQLToolsAuthenticationSession implements AuthenticationSession {
	public readonly id: string;
	public readonly accessToken: string;
	public readonly account: AuthenticationSessionAccountInformation;
	public readonly scopes: string[];
	constructor(
		public readonly serverName: string,
		public readonly userName: string,
		password: string,
	) {
		this.id = SQLToolsAuthenticationProvider.sessionId(serverName, userName);
		this.accessToken = password;
		this.account = { id: userName, label: `'${userName}' on '${serverName}'` };
		this.scopes = [serverName, userName];
	}
}
