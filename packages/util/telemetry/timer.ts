import { ITimer } from '@sqltools/types';

class Timer implements ITimer {
  private s: [number, number];
  private e: [number, number];

  constructor() {
    this.start();
  }

  /**
   * Returns the elapsed time im ms
   *
   * @returns {number} miliseconds elapsed
   * @memberof Timer
   */
  public elapsed(): number {
    if (!this.s) {
      return -1;
    } else if (!this.e) {
      const end = process.hrtime(this.s);
      return end[0] * 1000 + end[1] / 1000000;
    } else {
      return this.e[0] * 1000 + this.e[1] / 1000000;
    }
  }

  public start(): void {
    this.s = process.hrtime();
  }

  public end(): void {
    if (!this.e) {
      this.e = process.hrtime(this.s);
    }
  }
}

export default Timer;
