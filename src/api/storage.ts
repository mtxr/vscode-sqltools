import * as fs from 'fs';
import * as path from 'path';

import { getHome } from './utils';

class NotFoundException extends Error {}

export class Storage {
    private items: Object = {};
    private storagePath: string = path.join(getHome(), '.SQLToolsStorage.json');

    constructor() {
        if (!fs.existsSync(this.storagePath)) {
            fs.writeFileSync(this.storagePath, JSON.stringify(this.items));
        }

        this.items = JSON.parse(fs.readFileSync(this.storagePath, 'utf8'));
    }

    add(name: string, query: string): Storage {
        this.items[name] = query;
        return this.save();
    }

    get(key): Object {
        if (!this.items[key]) {
            throw new NotFoundException("No query selected")
        }
        return this.items[key];
    }

    delete(key): Storage {
        this.get(key);
        delete this.items[key];
        return this.save();
    }

    getSize = (): number => Object.keys(this.items).length;

    all = (): Object => this.items;

    clear(): Storage {
        this.items = [];
        return this;
    }

    save(): Storage {
        fs.writeFileSync(this.storagePath, JSON.stringify(this.items));
        return this;
    }
}
