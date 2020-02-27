import { window, QuickPickItem, QuickPickOptions, QuickPick } from 'vscode';
import { DismissedError } from '@sqltools/util/exception';

/**
 * @deprecated Will be removed in newer versions.
 */
 async function quickPickOldApi(options: QuickPickItem[], prop?: string): Promise<QuickPickItem | any> {
  const sel: QuickPickItem = await window.showQuickPick(options);
  if (!sel || (prop && !sel[prop])) throw new DismissedError();
  return prop ? sel[prop] : sel;
}

export type ExtendedQuickPickOptions<T extends QuickPickItem = QuickPickItem | any> = Partial<
  QuickPickOptions & {
    title: QuickPick<T>['title'];
    placeHolderDisabled?: QuickPick<T>['placeholder'];
    buttons?: QuickPick<T>['buttons'];
  }
>;

export async function quickPick<T = QuickPickItem | any>(
  options: ((QuickPickItem & { value?: any }) | string)[],
  prop?: string,
  quickPickOptions?: ExtendedQuickPickOptions
): Promise<QuickPickItem | any> {
  const items =
    options.length > 0 && typeof options[0] === 'object'
      ? <QuickPickItem[]>options
      : options.map<QuickPickItem>(value => ({
          value,
          label: value.toString(),
        }));

  if (typeof window.createQuickPick !== 'function') return quickPickOldApi(items, prop);

  const qPick = window.createQuickPick();
  const sel = await new Promise<QuickPickItem | any>(resolve => {
    const { placeHolderDisabled, ...qPickOptions } = quickPickOptions || ({} as ExtendedQuickPickOptions);
    qPick.onDidHide(() => qPick.dispose());
    qPick.onDidChangeSelection((selection = []) => {
      qPick.hide();
      return resolve(qPickOptions.canPickMany ? selection : selection[0]);
    });
    qPick.onDidTriggerButton((btn: any) => {
      if (btn.cb) btn.cb();
      qPick.hide();
    });

    Object.keys(qPickOptions).forEach(k => {
      qPick[k] = qPickOptions[k];
    });
    qPick.items = items;
    qPick.enabled = items.length > 0;

    if (!qPick.enabled) qPick.placeholder = placeHolderDisabled || qPick.placeholder;

    qPick.title = `${qPick.title || 'Items'} (${items.length})`;

    qPick.show();
  });
  if (!sel || (prop && !sel[prop])) throw new DismissedError();
  return <T>(prop ? sel[prop] : sel);
}

export async function quickPickSearch<T = any>(
  loadOptions: (search: string) => PromiseLike<(({ label: string; value?: T }))[]>,
  quickPickOptions?: ExtendedQuickPickOptions,
  debounceTime = 150
): Promise<T> {
  let items: QuickPickItem[] = [];
  const qPick = window.createQuickPick();
  const sel = await new Promise<any[]>(resolve => {
    const { placeHolderDisabled, ...qPickOptions } = quickPickOptions || ({} as ExtendedQuickPickOptions);
    let searchTimeout = null;
    qPick.onDidChangeValue((search) => {
      qPick.busy = true;
      if (!search || !search.trim()) {
        qPick.items = [];
        qPick.busy = false;
        return;
      }
      clearInterval(searchTimeout);
      searchTimeout = setTimeout(() => {
        const getOptsPromise = loadOptions(search);
        const catchFn = error => {
          qPick.items = [];
          qPick.busy = false;
          console.error(error);
        };
        const thenFn = (options: any[]) => {
          qPick.busy = false;
          qPick.items = options.length > 0 && typeof options[0] === 'object'
            ? <QuickPickItem[]>options.map(o => ({ ...o, value: o, label: o.value || o.label }))
            : options.map<QuickPickItem>(value => ({ value, label: value.toString() }));
        };
        if (getOptsPromise instanceof Promise || typeof getOptsPromise['catch'] === 'function') (<Promise<any>>getOptsPromise).then(thenFn).catch(catchFn);
        else getOptsPromise.then(thenFn, catchFn);
      }, debounceTime);
    });
    qPick.onDidHide(() => qPick.dispose());
    qPick.onDidChangeSelection((selection: (QuickPickItem & { value: any })[] = []) => {
      qPick.hide();
      resolve(selection.map(s => s.value));
      qPick.dispose();
    });
    qPick.onDidTriggerButton((btn: any) => {
      if (btn.cb)
        btn.cb();
      qPick.hide();
    });
    Object.keys(qPickOptions).forEach(k => {
      qPick[k] = qPickOptions[k];
    });
    qPick.items = items;
    qPick.enabled = items.length > 0;
    if (!qPick.enabled)
      qPick.placeholder = placeHolderDisabled || qPick.placeholder || 'Type something to search...';
    qPick.title = `${qPick.title || 'Items'} (${items.length})`;
    qPick.show();
  });

  if (!sel || (quickPickOptions.canPickMany && sel.length === 0)) throw new DismissedError();

  if (quickPickOptions.canPickMany) return sel as any as T;

  return sel.pop() as T;
}
