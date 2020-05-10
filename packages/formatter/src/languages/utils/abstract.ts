import { Config, Token, TokenizerConfig } from '../../core/types';
import Tokenizer from '../../core/Tokenizer';
import Formatter from '../../core/Formatter';

export default abstract class AbstractFormatter {
  /**
   * @param {Object} cfg Different set of configurations
   */
  constructor(public cfg: Config) { }


  abstract getTokenizerConfig(): TokenizerConfig;

  /**
   * Formats query
   *
   * @param {string} query raw query
   * @return {string} formatted string
   */
  format(query: string): string {
    return new Formatter(this.cfg, this.tokenizer(), this.tokenOverride).format(query);
  }

  tokenize(query: string): Token[] {
    return this.tokenizer().tokenize(query);
  }

  tokenizer() {
    return new Tokenizer(this.getTokenizerConfig());
  }

  protected tokenOverride?: (token: Token, previousToken?: Token) => Token;
}
