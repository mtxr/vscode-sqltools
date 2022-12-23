import {
	authentication,
	AuthenticationProvider,
	AuthenticationProviderAuthenticationSessionsChangeEvent,
	AuthenticationSession,
	Disposable,
	Event,
	EventEmitter,
	Memento,
	SecretStorage,
	ThemeIcon,
	window,
} from "vscode";
import { SQLToolsAuthenticationSession } from "./authenticationSession";
import { DISPLAY_NAME, AUTHENTICATION_PROVIDER } from '@sqltools/util/constants';

const AUTHENTICATION_PROVIDER_LABEL = `${DISPLAY_NAME} Driver Credentials`;

export class SQLToolsAuthenticationProvider implements AuthenticationProvider, Disposable {
	public static id = AUTHENTICATION_PROVIDER;
	public static label = AUTHENTICATION_PROVIDER_LABEL;
	public static secretKeyPrefix = "credentialProvider:";
	public static sessionId(serverName: string, userName: string): string {
		return `${serverName}/${userName}`;
	}
	public static credentialKey(sessionId: string): string {
		return `${SQLToolsAuthenticationProvider.secretKeyPrefix}${sessionId}`;
	}

	private _initializedDisposable: Disposable | undefined;
	private _sessions: SQLToolsAuthenticationSession[] = [];
	private _onDidChangeSessions = new EventEmitter<AuthenticationProviderAuthenticationSessionsChangeEvent>();

	get onDidChangeSessions(): Event<AuthenticationProviderAuthenticationSessionsChangeEvent> {
		return this._onDidChangeSessions.event;
	}

	constructor(private readonly _secretStorage: SecretStorage, private readonly _globalState: Memento) {
	}

	public dispose(): void {

		this._initializedDisposable?.dispose();
	}

	// This function is called first when `vscode.authentication.getSessions` is called.
	public async getSessions(scopes: string[] = []): Promise<readonly AuthenticationSession[]> {
		await this._ensureInitialized();
		let sessions = this._sessions;

		// Filter to return only those that match all supplied scopes, which are positional and case-sensitive.
		for (let index = 0; index < scopes.length; index++) {
			sessions = sessions.filter((session) => session.scopes[index] === scopes[index]);
		}
		return sessions;
	}

	// This function is called after `this.getSessions` is called, and only when:
	// - `this.getSessions` returns nothing but `createIfNone` was `true` in call to `vscode.authentication.getSession`
	// - `vscode.authentication.getSession` was called with `forceNewSession: true` or
	//   `forceNewSession: {detail: "Reason message for modal dialog"}`
	// - The end user initiates the "silent" auth flow via the Accounts menu
	public async createSession(scopes: string[]): Promise<AuthenticationSession> {
		await this._ensureInitialized();

		let serverName = scopes[0] ?? "";

		let userName = scopes[1] ?? "";

		// Return existing session if found
		const sessionId = SQLToolsAuthenticationProvider.sessionId(serverName, userName);
		const existingSession = this._sessions.find((s) => s.id === sessionId);
		if (existingSession) {
			return existingSession;
		}

		let password: string | undefined = "";

		// Seek password in this extension's secret storage
		const credentialKey = SQLToolsAuthenticationProvider.credentialKey(sessionId);
		password = await this._secretStorage.get(credentialKey);

		if (!password) {
			// Prompt for password
			const doInputBox = async (): Promise<string | undefined> => {
				return await new Promise<string | undefined>((resolve, _reject) => {
					const inputBox = window.createInputBox();
					inputBox.value = "";
					inputBox.password = true;
					inputBox.title = `${AUTHENTICATION_PROVIDER_LABEL}: Password for user '${userName}'`;
					inputBox.placeholder = `Password for user '${userName}' on '${serverName}'`;
					inputBox.prompt = "Optionally use $(key) button to store password securely until you sign out using the 'Accounts' menu.";
					inputBox.ignoreFocusOut = true;
					inputBox.buttons = [
						{
							iconPath: new ThemeIcon("key"),
							tooltip: "Store Password Securely in Workstation Keychain",
						},
					];

					async function done(secretStorage?: SecretStorage) {
						// Return the password, having stored it if storage was passed
						const enteredPassword = inputBox.value;
						if (secretStorage && enteredPassword) {
							await secretStorage.store(credentialKey, enteredPassword);
							console.log(`Stored password at ${credentialKey}`);
						}
						// Resolve the promise and tidy up
						resolve(enteredPassword);
						inputBox.dispose();
					}

					inputBox.onDidTriggerButton((_button) => {
						// We only added the one button, which stores the password
						done(this._secretStorage);
					});

					inputBox.onDidAccept(() => {
						// User pressed Enter
						done();
					});

					inputBox.onDidHide(() => {
						// User pressed Escape
						resolve(undefined);
						inputBox.dispose();
					});

					inputBox.show();
				});
			};
			password = await doInputBox();
			if (!password) {
				throw new Error(`${AUTHENTICATION_PROVIDER_LABEL}: Password is required.`);
			}
		}

		// We have all we need to create the session object
		const session = new SQLToolsAuthenticationSession(serverName, userName, password);
		// Update this._sessions and raise the event to notify
		const added: AuthenticationSession[] = [];
		const changed: AuthenticationSession[] = [];
		const index = this._sessions.findIndex((item) => item.id === session.id);
		if (index !== -1) {
			this._sessions[index] = session;
			changed.push(session);
		} else {
			this._sessions.push(session);
			added.push(session);
		}
		await this._storeStrippedSessions();
		this._onDidChangeSessions.fire({ added, removed: [], changed });
		return session;
	}

	// This function is called when the end user signs out of the account.
	public async removeSession(sessionId: string): Promise<void> {
		const index = this._sessions.findIndex((item) => item.id === sessionId);
		const session = this._sessions[index];

		const credentialKey = SQLToolsAuthenticationProvider.credentialKey(sessionId);
		if (await this._secretStorage.get(credentialKey)) {
			// Always delete from secret storage when logging out so we don't have to worry about orphaned passwords
			await this._secretStorage.delete(credentialKey);
			console.log(`${AUTHENTICATION_PROVIDER_LABEL}: Deleted stored password at ${credentialKey}`);
		}
		if (index > -1) {
			// Remove session here so we don't store it
			this._sessions.splice(index, 1);
		}
		await this._storeStrippedSessions();
		this._onDidChangeSessions.fire({ added: [], removed: [session], changed: [] });
	}

	private async _ensureInitialized(): Promise<void> {
		if (this._initializedDisposable === undefined) {

			// Get the previously-persisted array of sessions that were stripped of their accessTokens (aka passwords)
			await this._reloadSessions();

			this._initializedDisposable = Disposable.from(
				// This onDidChange event happens when the secret storage changes in _any window_ since
				// secrets are shared across all open windows.
				this._secretStorage.onDidChange(async (e) => {
					for (const session of this._sessions) {
						const credentialKey = SQLToolsAuthenticationProvider.credentialKey(session.id);
						if (credentialKey === e.key) {
							const password = await this._secretStorage.get(credentialKey);

							// Only look up the session in _sessions after the await for password has completed,
							// in case _sessions has been changed elsewhere in the meantime
							const index = this._sessions.findIndex((sess) => sess.id === session.id);
							if (index > -1) {
								if (!password) {
									this._sessions.splice(index, 1);
								} else {
									this._sessions[index] = new SQLToolsAuthenticationSession(
										session.serverName,
										session.userName,
										password,
									);
								}
							}
						}
					}
				}),
				// This fires when the user initiates a "silent" auth flow via the Accounts menu.
				authentication.onDidChangeSessions(async (e) => {
					if (e.provider.id === SQLToolsAuthenticationProvider.id) {
						// TODO what, of anything?
					}
				}),
			);
		}
	}

	private async _reloadSessions() {
		const strippedSessions = this._globalState.get<SQLToolsAuthenticationSession[]>(
			"authenticationProvider.strippedSessions",
			[],
		);

		// Build our array of sessions for which non-empty accessTokens were securely persisted
		this._sessions = (await Promise.all(
			strippedSessions.map(async (session) => {
				const credentialKey = SQLToolsAuthenticationProvider.credentialKey(session.id);
				const accessToken = await this._secretStorage.get(credentialKey);
				return new SQLToolsAuthenticationSession(session.serverName, session.userName, accessToken);
			}),
		)).filter((session) => session.accessToken);
	}

	private async _storeStrippedSessions() {
		// Build an array of sessions with passwords blanked
		const strippedSessions = this._sessions.map((session) => {
			return new SQLToolsAuthenticationSession(
				session.serverName,
				session.userName,
				"",
			);
		});

		// Persist it
		await this._globalState.update(
			"authenticationProvider.strippedSessions",
			strippedSessions,
		);
	}
}
