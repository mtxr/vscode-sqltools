import escapeRegExp from '../src/core/escapeRegExp';
import last from '../src/core/last';

const stubString = () => '';

describe('escapeRegExp', () => {
  var escaped = '\\^\\$\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\\\',
      unescaped = '^$.*+?()[]{}|\\';

  it('should escape values', () => {
    expect(escapeRegExp(unescaped + unescaped)).toEqual(escaped + escaped);
  });

  it('should handle strings with nothing to escape', () => {
    expect(escapeRegExp('abc')).toEqual('abc');
  });

  it('should return an empty string for empty values', () => {
    var values = [, null, undefined, ''],
        expected = values.map(stubString);

    var actual = values.map((value, index) => {
      return index ? escapeRegExp(value) : escapeRegExp();
    });

    expect(actual).toEqual(expected);
  });

  it('should return last item of array', () => {
    expect(last(['a', 'b'])).toEqual('b');
    expect(last([])).toEqual(undefined);
    expect(last()).toEqual(undefined);
  });
});
