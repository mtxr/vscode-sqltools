"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseDataUrl;
const removeLeadingAndTrailingHTTPWhitespace = string => string.replace(/^[ \t\n\r]+/, "").replace(/[ \t\n\r]+$/, "");
const removeTrailingHTTPWhitespace = string => string.replace(/[ \t\n\r]+$/, "");
const isHTTPWhitespaceChar = char => char === " " || char === "\t" || char === "\n" || char === "\r";
const solelyContainsHTTPTokenCodePoints = string => /^[-!#$%&'*+.^_`|~A-Za-z0-9]*$/.test(string);
const soleyContainsHTTPQuotedStringTokenCodePoints = string => /^[\t\u0020-\u007E\u0080-\u00FF]*$/.test(string);
const asciiLowercase = string => string.replace(/[A-Z]/g, l => l.toLowerCase());
const collectAnHTTPQuotedString = (input, position) => {
  let value = "";

  // eslint-disable-next-line no-param-reassign
  position += 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    while (position < input.length && input[position] !== '"' && input[position] !== "\\") {
      value += input[position];
      // eslint-disable-next-line no-param-reassign
      position += 1;
    }
    if (position >= input.length) {
      break;
    }
    const quoteOrBackslash = input[position];

    // eslint-disable-next-line no-param-reassign
    position += 1;
    if (quoteOrBackslash === "\\") {
      if (position >= input.length) {
        value += "\\";
        break;
      }
      value += input[position];
      // eslint-disable-next-line no-param-reassign
      position += 1;
    } else {
      break;
    }
  }
  return [value, position];
};
function isASCIIHex(c) {
  return c >= 0x30 && c <= 0x39 || c >= 0x41 && c <= 0x46 || c >= 0x61 && c <= 0x66;
}
function percentDecodeBytes(input) {
  const output = new Uint8Array(input.byteLength);
  let outputIndex = 0;
  for (let i = 0; i < input.byteLength; ++i) {
    const byte = input[i];
    if (byte !== 0x25) {
      output[outputIndex] = byte;
    } else if (byte === 0x25 && (!isASCIIHex(input[i + 1]) || !isASCIIHex(input[i + 2]))) {
      output[outputIndex] = byte;
    } else {
      output[outputIndex] = parseInt(String.fromCodePoint(input[i + 1], input[i + 2]), 16);
      i += 2;
    }
    outputIndex += 1;
  }
  return output.slice(0, outputIndex);
}

/**
 * A lookup table for atob(), which converts an ASCII character to the
 * corresponding six-bit number.
 */

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function atobLookup(chr) {
  const index = characters.indexOf(chr);
  // Throw exception if character is not in the lookup string; should not be hit in tests
  // eslint-disable-next-line no-undefined
  return index < 0 ? undefined : index;
}

/**
 * Implementation of atob() according to the HTML and Infra specs, except that
 * instead of throwing INVALID_CHARACTER_ERR we return null.
 */
function atob(input) {
  /* eslint-disable no-bitwise */
  // Web IDL requires DOMStrings to just be converted using ECMAScript
  // ToString, which in our case amounts to using a template literal.
  let data = `${input}`;

  // "Remove all ASCII whitespace from data."
  data = data.replace(/[ \t\n\f\r]/g, "");

  // "If data's length divides by 4 leaving no remainder, then: if data ends
  // with one or two U+003D (=) code points, then remove them from data."
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, "");
  }

  // "If data's length divides by 4 leaving a remainder of 1, then return
  // failure."
  //
  // "If data contains a code point that is not one of
  //
  // U+002B (+)
  // U+002F (/)
  // ASCII alphanumeric
  //
  // then return failure."
  if (data.length % 4 === 1 || /[^+/0-9A-Za-z]/.test(data)) {
    return null;
  }

  // "Let output be an empty byte sequence."
  let output = "";

  // "Let buffer be an empty buffer that can have bits appended to it."
  //
  // We append bits via left-shift and or.  accumulatedBits is used to track
  // when we've gotten to 24 bits.
  let buffer = 0;
  let accumulatedBits = 0;

  // "Let position be a position variable for data, initially pointing at the
  // start of data."
  //
  // "While position does not point past the end of data:"
  for (let i = 0; i < data.length; i++) {
    // "Find the code point pointed to by position in the second column of
    // Table 1: The Base 64 Alphabet of RFC 4648. Let n be the number given in
    // the first cell of the same row.
    //
    // "Append to buffer the six bits corresponding to n, most significant bit
    // first."
    //
    // atobLookup() implements the table from RFC 4648.
    // eslint-disable-next-line no-bitwise
    buffer <<= 6;

    // eslint-disable-next-line no-bitwise
    buffer |= atobLookup(data[i]);
    accumulatedBits += 6;

    // "If buffer has accumulated 24 bits, interpret them as three 8-bit
    // big-endian numbers. Append three bytes with values equal to those
    // numbers to output, in the same order, and then empty buffer."
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 0xff0000) >> 16);
      output += String.fromCharCode((buffer & 0xff00) >> 8);
      output += String.fromCharCode(buffer & 0xff);
      accumulatedBits = 0;
      buffer = 0;
    }
    // "Advance position by 1."
  }

  // "If buffer is not empty, it contains either 12 or 18 bits. If it contains
  // 12 bits, then discard the last four and interpret the remaining eight as
  // an 8-bit big-endian number. If it contains 18 bits, then discard the last
  // two and interpret the remaining 16 as two 8-bit big-endian numbers. Append
  // the one or two bytes with values equal to those one or two numbers to
  // output, in the same order."
  if (accumulatedBits === 12) {
    buffer >>= 4;
    output += String.fromCharCode(buffer);
  } else if (accumulatedBits === 18) {
    buffer >>= 2;
    output += String.fromCharCode((buffer & 0xff00) >> 8);
    output += String.fromCharCode(buffer & 0xff);
  }
  /* eslint-enable no-bitwise */

  // "Return output."
  return output;
}
function parseDataUrl(stringInput) {
  let parsedUrl;
  try {
    parsedUrl = new URL(stringInput);
  } catch (error) {
    return null;
  }
  if (parsedUrl.protocol !== "data:") {
    return null;
  }
  parsedUrl.hash = "";

  // `5` is value of `'data:'.length`
  const input = parsedUrl.toString().substring(5);
  let position = 0;
  let mediaType = "";
  while (position < input.length && input[position] !== ",") {
    mediaType += input[position];
    position += 1;
  }
  mediaType = mediaType.replace(/^[ \t\n\f\r]+/, "").replace(/[ \t\n\f\r]+$/, "");
  if (position === input.length) {
    return null;
  }
  position += 1;
  const encodedBody = input.substring(position);
  let body = Buffer.from(percentDecodeBytes(Buffer.from(encodedBody, "utf-8")));

  // Can't use /i regexp flag because it isn't restricted to ASCII.
  const mimeTypeBase64MatchResult = /(.*); *[Bb][Aa][Ss][Ee]64$/.exec(mediaType);
  if (mimeTypeBase64MatchResult) {
    const stringBody = body.toString("binary");
    const asString = atob(stringBody);
    if (asString === null) {
      return null;
    }
    body = Buffer.from(asString, "binary");
    [, mediaType] = mimeTypeBase64MatchResult;
  }
  if (mediaType.startsWith(";")) {
    mediaType = `text/plain ${mediaType}`;
  }
  const result = {
    // eslint-disable-next-line no-undefined
    type: undefined,
    // eslint-disable-next-line no-undefined
    subtype: undefined,
    parameters: new Map(),
    isBase64: Boolean(mimeTypeBase64MatchResult),
    body
  };
  if (!mediaType) {
    return result;
  }
  const inputMediaType = removeLeadingAndTrailingHTTPWhitespace(mediaType);
  let positionMediaType = 0;
  let type = "";
  while (positionMediaType < inputMediaType.length && inputMediaType[positionMediaType] !== "/") {
    type += inputMediaType[positionMediaType];
    positionMediaType += 1;
  }
  if (type.length === 0 || !solelyContainsHTTPTokenCodePoints(type)) {
    return result;
  }
  if (positionMediaType >= inputMediaType.length) {
    return result;
  }

  // Skips past "/"
  positionMediaType += 1;
  let subtype = "";
  while (positionMediaType < inputMediaType.length && inputMediaType[positionMediaType] !== ";") {
    subtype += inputMediaType[positionMediaType];
    positionMediaType += 1;
  }
  subtype = removeTrailingHTTPWhitespace(subtype);
  if (subtype.length === 0 || !solelyContainsHTTPTokenCodePoints(subtype)) {
    return result;
  }
  result.type = asciiLowercase(type);
  result.subtype = asciiLowercase(subtype);
  while (positionMediaType < inputMediaType.length) {
    // Skip past ";"
    positionMediaType += 1;
    while (isHTTPWhitespaceChar(inputMediaType[positionMediaType])) {
      positionMediaType += 1;
    }
    let parameterName = "";
    while (positionMediaType < inputMediaType.length && inputMediaType[positionMediaType] !== ";" && inputMediaType[positionMediaType] !== "=") {
      parameterName += inputMediaType[positionMediaType];
      positionMediaType += 1;
    }
    parameterName = asciiLowercase(parameterName);
    if (positionMediaType < inputMediaType.length) {
      if (inputMediaType[positionMediaType] === ";") {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Skip past "="
      positionMediaType += 1;
    }
    let parameterValue = "";
    if (inputMediaType[positionMediaType] === '"') {
      [parameterValue, positionMediaType] = collectAnHTTPQuotedString(inputMediaType, positionMediaType);
      while (positionMediaType < inputMediaType.length && inputMediaType[positionMediaType] !== ";") {
        positionMediaType += 1;
      }
    } else {
      while (positionMediaType < inputMediaType.length && inputMediaType[positionMediaType] !== ";") {
        parameterValue += inputMediaType[positionMediaType];
        positionMediaType += 1;
      }
      parameterValue = removeTrailingHTTPWhitespace(parameterValue);
      if (parameterValue === "") {
        // eslint-disable-next-line no-continue
        continue;
      }
    }
    if (parameterName.length > 0 && solelyContainsHTTPTokenCodePoints(parameterName) && soleyContainsHTTPQuotedStringTokenCodePoints(parameterValue) && !result.parameters.has(parameterName)) {
      result.parameters.set(parameterName, parameterValue);
    }
  }
  return result;
}