import { Token } from './types';

/**
 * Handles placeholder replacement with given params.
 */
export default class Params {
  private index = 0;
  /**
   * @param {Object} params
   */
  constructor(public params: Object) {
    this.params = params;
  }

  /**
   * Returns param value that matches given placeholder with param key.
   * @param {Token} token
   *   @param {string} token.key Placeholder key
   *   @param {string} token.value Placeholder value
   * @return {string} param or token.value when params are missing
   */
  get({ key, value }: Token) {
    if (!this.params) {
      return value;
    }
    if (key) {
      return this.params[key];
    }
    return this.params[this.index++];
  }
}
