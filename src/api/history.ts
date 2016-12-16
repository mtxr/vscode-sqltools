class SizeException extends Error {}

class NotFoundException extends Error {}

class History {
    private items: string[] = [];
    private maxSize: number = 100;

    constructor(maxSize: number = 100) {
        this.maxSize = maxSize;
    }

    add(query: string) {
        if (this.getSize() >= this.getMaxSize()) {
            this.items.shift();
        }

        this.items.push(query)
    }

    get(index) {
        if (index < 0 || index > this.items.length - 1) {
            throw new NotFoundException("No query selected")
        }

        return this.items[index]
    }

    setMaxSize(size: number) {
        if (size < 1) {
            throw new SizeException("Size can't be lower than 1");
        }

        this.maxSize = size;
        return this.maxSize;
    }

    getMaxSize = () => this.maxSize;

    getSize = () => this.items.length;

    all = () => this.items;

    clear() {
        this.items = [];
        return this.items;
    }
}
export {
    History
}
