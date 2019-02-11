import { NotFoundException, SizeException } from '@sqltools/core/exception';

export default class History {
  private items: string[] = [];
  private maxSize: number = 100;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  public add(query: string): this {
    if (this.items[this.items.length - 1] && this.items[this.items.length - 1].trim() === query.trim()) {
      return this;
    }

    this.items = [query].concat(this.items);

    if (this.getSize() >= this.getMaxSize()) {
      this.items.length = this.maxSize;
    }

    return this;
  }

  public get(index): string {
    if (index < 0 || index > this.items.length - 1) {
      throw new NotFoundException('No query selected');
    }

    return this.items[index];
  }

  public setMaxSize(size: number): number {
    if (size < 1) {
      throw new SizeException('Size can\'t be lower than 1');
    }

    this.maxSize = size;
    return this.maxSize;
  }

  public getMaxSize(): number {
    return this.maxSize;
  }

  public getSize(): number {
    return this.items.length;
  }

  public all(): string[] {
    return this.items;
  }

  public clear(): this {
    this.items = [];
    return this;
  }
}
