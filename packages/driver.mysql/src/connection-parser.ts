/**
 * Pure helpers that transform `connInfo` between the stored settings shape and
 * the connection-form shape.
 */

/**
 * A password mode describes one choice in the "Password mode" dropdown.
 *
 * - `label`:       user-facing value stored in `connInfo.usePassword` while
 *                  the user is editing the form.
 * - `matches`:     case-insensitive substring used to detect the mode on save
 *                  (kept for backwards-compat with older saved values).
 * - `owns`:        properties on `connInfo` that this mode manages. On save
 *                  these are wiped for every *other* mode, so switching modes
 *                  never leaves stale config behind.
 * - `onSave`:      optional mutations applied on save (e.g. set a flag).
 * - `matchesSaved`: predicate used on edit to detect the mode from the stored
 *                  shape (reverse of `onSave`).
 */
interface PasswordMode {
  readonly label: string;
  readonly matches: string;
  readonly owns: ReadonlyArray<string>;
  readonly onSave?: (connInfo: any) => void;
  readonly matchesSaved: (connInfo: any) => boolean;
}

export const PASSWORD_MODES: ReadonlyArray<PasswordMode> = [
  {
    label: 'Ask on connect',
    matches: 'ask',
    owns: ['askForPassword'],
    onSave: (c) => { c.askForPassword = true; },
    matchesSaved: (c) => c.askForPassword === true,
  },
  {
    label: 'Use empty password',
    matches: 'empty',
    owns: ['password'],
    onSave: (c) => { c.password = ''; },
    matchesSaved: (c) => c.password === '',
  },
  {
    label: 'Save as plaintext in settings',
    matches: 'save',
    owns: ['password'],
    matchesSaved: (c) => typeof c.password === 'string' && c.password.length > 0,
  },
  {
    label: 'IAM database authentication',
    matches: 'iam',
    owns: ['useAwsIamAuth', 'awsIamOptions'],
    onSave: (c) => { c.useAwsIamAuth = true; },
    matchesSaved: (c) => c.useAwsIamAuth === true,
  },
  // "SQLTools Driver Credentials" is the default. It owns nothing so every
  // other mode's fields get cleaned up when switching to it.
  {
    label: 'SQLTools Driver Credentials',
    matches: 'secure', // kept for backwards-compat with an older internal label
    owns: [],
    matchesSaved: () => true, // catch-all fallback
  },
];

function findModeFromForm(value: unknown): PasswordMode | undefined {
  if (typeof value !== 'string') return undefined;
  const lowered = value.toLowerCase();
  const match = PASSWORD_MODES.find(m => lowered.includes(m.matches));
  if (match) return match;
  return PASSWORD_MODES[PASSWORD_MODES.length - 1];
}

function findModeFromSaved(connInfo: any): PasswordMode {
  return PASSWORD_MODES.find(m => m.matchesSaved(connInfo)) as PasswordMode;
}

function allOwnedProps(): string[] {
  const set = new Set<string>();
  for (const mode of PASSWORD_MODES) {
    for (const prop of mode.owns) set.add(prop);
  }
  return Array.from(set);
}

export function parseBeforeSaveConnection({ connInfo }: { connInfo: any }): any {
  const propsToRemove = new Set<string>(['connectionMethod', 'id', 'usePassword']);

  const activeMode = findModeFromForm(connInfo.usePassword);
  if (activeMode) {
    activeMode.onSave?.(connInfo);
    const keep = new Set(activeMode.owns);
    for (const prop of allOwnedProps()) {
      if (!keep.has(prop)) propsToRemove.add(prop);
    }
  }

  if (connInfo.connectString) {
    propsToRemove.add('port');
    for (const prop of allOwnedProps()) propsToRemove.add(prop);
  }

  for (const prop of propsToRemove) delete connInfo[prop];

  connInfo.mysqlOptions = connInfo.mysqlOptions || {};
  if (connInfo.mysqlOptions.enableSsl === 'Disabled') {
    delete connInfo.mysqlOptions.ssl;
  }
  if (typeof connInfo.mysqlOptions.ssl === 'object' && Object.keys(connInfo.mysqlOptions.ssl).length === 0) {
    connInfo.mysqlOptions.enableSsl = 'Disabled';
    delete connInfo.mysqlOptions.ssl;
  }
  return connInfo;
}

export function parseBeforeEditConnection({ connInfo }: { connInfo: any }): any {
  const formData: typeof connInfo = {
    ...connInfo,
    connectionMethod: 'Server and Port',
  };
  if (connInfo.socketPath) {
    formData.connectionMethod = 'Socket File';
  } else if (connInfo.connectString) {
    formData.connectionMethod = 'Connection String';
  }

  const savedMode = findModeFromSaved(connInfo);
  formData.usePassword = savedMode.label;

  const keep = new Set(savedMode.owns);
  for (const prop of allOwnedProps()) {
    if (!keep.has(prop)) delete formData[prop];
  }

  return formData;
}
