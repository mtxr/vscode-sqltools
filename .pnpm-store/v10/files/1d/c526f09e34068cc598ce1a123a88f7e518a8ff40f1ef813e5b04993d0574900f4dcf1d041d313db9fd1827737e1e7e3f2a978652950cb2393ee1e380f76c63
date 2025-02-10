import privateClassElements from 'acorn-private-class-elements';

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

export default privateMethods;
//# sourceMappingURL=acorn-private-methods.mjs.map
