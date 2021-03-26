import escapeRegExp from '../src/core/escapeRegExp';
import last from '../src/core/last';

const stubString = () => '';

describe('escapeRegExp', () => {
  const escaped = '\\^\\$\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\\\',
    unescaped = '^$.*+?()[]{}|\\';

  it('should escape values', () => {
    expect(escapeRegExp(unescaped + unescaped)).toEqual(escaped + escaped);
  });

  it('should handle strings with nothing to escape', () => {
    expect(escapeRegExp('abc')).toEqual('abc');
  });

  it('should return an empty string for empty values', () => {
    const values = [undefined, null, undefined, ''],
      expected = values.map(stubString);

    const actual = values.map(value => escapeRegExp(value));

    expect(actual).toEqual(expected);
  });

  it('should return last item of array', () => {
    expect(last(['a', 'b'])).toEqual('b');
    expect(last([])).toEqual(undefined);
    expect(last()).toEqual(undefined);
  });
});
