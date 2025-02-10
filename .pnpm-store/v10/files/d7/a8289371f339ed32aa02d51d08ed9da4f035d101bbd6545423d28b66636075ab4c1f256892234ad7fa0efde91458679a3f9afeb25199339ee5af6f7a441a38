var ensureArray = function ensureArray(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (value === undefined || value === null) {
    return [].concat(defaultValue);
  }

  return Array.isArray(value) ? value : [].concat(value);
};

var ensureBigInt = function ensureBigInt(value, defaultValue) {
  var _defaultValue;

  if (!(typeof BigInt === 'function' && typeof BigInt(0) === 'bigint')) {
    throw new Error('BigInt is not defined');
  }

  defaultValue = (_defaultValue = defaultValue) !== null && _defaultValue !== void 0 ? _defaultValue : BigInt(0);

  if (value === undefined || value === null) {
    return ensureBigInt(defaultValue);
  }

  if (typeof value === 'bigint') {
    return value;
  }

  try {
    // A `BigInt` is created by appending `n` to the end of an integer literal or by calling the function `BigInt()`.
    value = BigInt(value); // big integer coercible value
  } catch (e) {
    value = ensureBigInt(defaultValue);
  }

  return value;
};

var ensureBoolean = function ensureBoolean(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (value === undefined || value === null) {
    return Boolean(defaultValue);
  }

  return typeof value === 'boolean' ? value : Boolean(value); // boolean coercible value
};

var ensureFunction = function ensureFunction(value, defaultValue) {
  var _defaultValue;

  defaultValue = (_defaultValue = defaultValue) !== null && _defaultValue !== void 0 ? _defaultValue : function () {};

  if (value === undefined || value === null) {
    return ensureFunction(defaultValue);
  }

  return typeof value === 'function' ? value : ensureFunction(defaultValue);
};

/**
 * The trunc() function returns the integer part of a number by removing any fractional digits.
 */
var trunc = function trunc(v) {
  return v < 0 ? Math.ceil(v) : Math.floor(v);
};

var ensureNumber = function ensureNumber(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (value === undefined || value === null) {
    return ensureNumber(defaultValue);
  }

  value = Number(value); // number coercible value

  if (Number.isNaN(value)) {
    return ensureNumber(defaultValue);
  }

  return value;
};

var ensureNegativeNumber = function ensureNegativeNumber(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -0;
  return Math.min(ensureNumber(value, defaultValue), -0);
};

var ensurePositiveNumber = function ensurePositiveNumber(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.max(ensureNumber(value, defaultValue), 0);
};

var ensureFiniteNumber = function ensureFiniteNumber(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  value = ensureNumber(value, defaultValue); // Determines whether the passed value is a finite number

  if (typeof value === 'number' && isFinite(value)) {
    return value;
  }

  return ensureFiniteNumber(defaultValue);
};

var ensureNegativeFiniteNumber = function ensureNegativeFiniteNumber(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -0;
  return Math.min(ensureFiniteNumber(value, defaultValue), -0);
};

var ensurePositiveFiniteNumber = function ensurePositiveFiniteNumber(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.max(ensureFiniteNumber(value, defaultValue), 0);
};

var ensureInteger = function ensureInteger(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  value = ensureFiniteNumber(value, defaultValue);
  return trunc(value);
};
/**
 * An integer is negative if it is less than zero.
 */


var ensureNegativeInteger = function ensureNegativeInteger(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
  return Math.min(ensureInteger(value, defaultValue), -1);
};
/**
 * An integer is positive if it is greater than zero.
 */


var ensurePositiveInteger = function ensurePositiveInteger(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return Math.max(ensureInteger(value, defaultValue), 1);
};
/**
 * A non-negative integer is an integer that is either zero or positive.
 */


var ensureNonNegativeInteger = function ensureNonNegativeInteger(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.max(ensureInteger(value, defaultValue), 0);
};
/**
 * A non-positive integer is an integer that is either zero or negative.
 */


var ensureNonPositiveInteger = function ensureNonPositiveInteger(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -0;
  return Math.min(ensureInteger(value, defaultValue), -0);
};

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
var isPlainObject = function isPlainObject(obj) {
  if (_typeof(obj) !== 'object' || obj === null) {
    return false;
  }

  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
};

var ensurePlainObject = function ensurePlainObject(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (value === undefined || value === null) {
    return ensurePlainObject(defaultValue);
  }

  return isPlainObject(value) ? value : ensurePlainObject(defaultValue);
};

var ensureString = function ensureString(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (value === undefined || value === null) {
    return String(defaultValue);
  }

  return typeof value === 'string' ? value : String(value); // string coercible value
};

export { ensureArray, ensureBigInt, ensureBoolean, ensureFiniteNumber, ensureFunction, ensureInteger, ensureNegativeFiniteNumber, ensureNegativeInteger, ensureNegativeNumber, ensureNonNegativeInteger, ensureNonPositiveInteger, ensureNumber, ensurePlainObject, ensurePositiveFiniteNumber, ensurePositiveInteger, ensurePositiveNumber, ensureString };
