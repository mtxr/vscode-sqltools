import path from 'path';
import SerializableStorage from '@sqltools/core/utils/serializable-storage';
import { getHome } from '@sqltools/core/utils/get-home';

export default class BookmarksStorage<V = string, K = string> extends SerializableStorage<V, K> {
  constructor(public name: string = '.Bookmarks') {
    super(path.join(getHome(), `${name}.SQLToolsStorage.json`), {});
  }

  public getSize = (): number => Object.keys(this.items).length;

  public all = (): { [id: string]: V } => this.items;
}
