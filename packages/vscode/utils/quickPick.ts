import { window, QuickPickItem, QuickPickOptions, QuickPick } from 'vscode';
import { DismissedError } from '@sqltools/util/exception';
import { createLogger } from '@sqltools/log/src';

const log = createLogger('quickpick');
export type ExtendedQuickPickOptions<T extends QuickPickItem = QuickPickItem | any> = Partial<
  QuickPickOptions & {
    title: QuickPick<T>['title'];
    placeHolderDisabled?: QuickPick<T>['placeholder'];
    buttons?: QuickPick<T>['buttons'];
    debounceTime: number;
    ignoreIfEmpty: boolean;
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

    // Handle case discrepancy between our property name and the vscode one
    qPick.placeholder = qPickOptions.placeHolder;
    delete qPickOptions.placeHolder;

    Object.keys(qPickOptions).forEach(k => {
      qPick[k] = qPickOptions[k];
    });
    qPick.items = items;

    if (!items.length) qPick.placeholder = placeHolderDisabled || qPick.placeholder;

    qPick.title = `${qPickOptions.title || 'Items'} (${items.length})`;

    qPick.show();
  });
  if (!sel || (prop && !sel[prop])) throw new DismissedError();
  return <T>(prop ? sel[prop] : sel);
}

export async function quickPickSearch<T = any>(
  loadOptions: (search: string) => PromiseLike<(({ label: string; value?: T }))[]>,
  quickPickOptions: ExtendedQuickPickOptions = {},
): Promise<T> {
  const qPick = window.createQuickPick();
  qPick.placeholder = qPick.placeholder || 'Type something to search...';
  const sel = await new Promise<any[]>(resolve => {
    const { placeHolderDisabled, debounceTime = 150, ignoreIfEmpty = false, ...qPickOptions } = quickPickOptions;
    let searchTimeout = null;
    const onChangeValue = (search = '') => {
      qPick.busy = true;
      if (ignoreIfEmpty && (!search || !search.trim())) {
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
          qPick.title = `${qPickOptions.title || 'Items'} (${qPick.items.length})`;
          log.error('search error: %O', error);
          return Promise.reject(error);
        };
        const thenFn = (options: any[]) => {
          qPick.busy = false;
          qPick.items = options.length > 0 && typeof options[0] === 'object'
            ? <QuickPickItem[]>options.map(o => ({ ...o, value: o, label: o.value || o.label }))
            : options.map<QuickPickItem>(value => ({ value, label: value.toString() }));
          qPick.title = `${qPickOptions.title || 'Items'} (${qPick.items.length})`;
        };
        if (getOptsPromise instanceof Promise || typeof getOptsPromise['catch'] === 'function') (<Promise<any>>getOptsPromise).then(thenFn).catch(catchFn);
        else getOptsPromise.then(thenFn, catchFn);
      }, debounceTime);
    };
    qPick.onDidChangeValue(onChangeValue);
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

    if (!ignoreIfEmpty) onChangeValue();
    qPick.show();
  });

  if (!sel || (quickPickOptions.canPickMany && sel.length === 0)) throw new DismissedError();

  if (quickPickOptions.canPickMany) return sel as any as T;

  return sel.pop() as T;
}
