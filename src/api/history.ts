import { NotFoundException, SizeException } from './exception';

export default class History {
  private items: string[] = [];
  private maxSize: number = 100;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  public add(query: string) {
    if (this.getSize() >= this.getMaxSize()) {
      this.items.length = this.maxSize - 1;
    }

    this.items.push(query);
  }

  public get(index) {
    if (index < 0 || index > this.items.length - 1) {
      throw new NotFoundException('No query selected');
    }

    return this.items[index];
  }

  public setMaxSize(size: number) {
    if (size < 1) {
      throw new SizeException('Size can\'t be lower than 1');
    }

    this.maxSize = size;
    return this.maxSize;
  }

  public getMaxSize = () => this.maxSize;

  public getSize = () => this.items.length;

  public all = () => this.items;

  public clear() {
    this.items = [];
    return this.items;
  }
}
