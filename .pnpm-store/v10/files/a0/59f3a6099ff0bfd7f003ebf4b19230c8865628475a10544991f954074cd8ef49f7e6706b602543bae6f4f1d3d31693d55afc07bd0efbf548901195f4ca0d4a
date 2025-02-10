'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var privateClassElements = _interopDefault(require('acorn-private-class-elements'));

// eslint-disable-next-line node/no-unsupported-features/es-syntax

// eslint-disable-next-line node/no-unsupported-features/es-syntax
function privateMethods(Parser) {
  const ExtendedParser = privateClassElements(Parser);

  return class extends ExtendedParser {
    // Parse private methods
    parseClassElement(_constructorAllowsSuper) {
      const oldInClassMemberName = this._inClassMemberName;
      this._inClassMemberName = true;
      const result = super.parseClassElement.apply(this, arguments);
      this._inClassMemberName = oldInClassMemberName;
      return result
    }

    parsePropertyName(prop) {
      const isPrivate = this.options.ecmaVersion >= 8 && this._inClassMemberName && this.type == this.privateNameToken && !prop.static;
      this._inClassMemberName = false;
      if (!isPrivate) return super.parsePropertyName(prop)
      return this.parsePrivateClassElementName(prop)
    }
  }
}

module.exports = privateMethods;
//# sourceMappingURL=acorn-private-methods.js.map
