"use strict"

const privateClassElements = require("acorn-private-class-elements")

module.exports = function(Parser) {
  const acorn = Parser.acorn || require("acorn")
  const tt = acorn.tokTypes

  Parser = privateClassElements(Parser)
  return class extends Parser {
    _maybeParseFieldValue(field) {
      if (this.eat(tt.eq)) {
        const oldInFieldValue = this._inFieldValue
        this._inFieldValue = true
        if (this.type === tt.name && this.value === "await" && (this.inAsync || this.options.allowAwaitOutsideFunction)) {
          field.value = this.parseAwait()
        } else field.value = this.parseExpression()
        this._inFieldValue = oldInFieldValue
      } else field.value = null
    }

    // Parse fields
    parseClassElement(_constructorAllowsSuper) {
      if (this.options.ecmaVersion >= 8 && (this.type == tt.name || this.type.keyword || this.type == this.privateNameToken || this.type == tt.bracketL || this.type == tt.string || this.type == tt.num)) {
        const branch = this._branch()
        if (branch.type == tt.bracketL) {
          let count = 0
          do {
            if (branch.eat(tt.bracketL)) ++count
            else if (branch.eat(tt.bracketR)) --count
            else branch.next()
          } while (count > 0)
        } else branch.next(true)
        let isField = branch.type == tt.eq || branch.type == tt.semi
        if (!isField && branch.canInsertSemicolon()) {
          isField = branch.type != tt.parenL
        }
        if (isField) {
          const node = this.startNode()
          if (this.type == this.privateNameToken) {
            this.parsePrivateClassElementName(node)
          } else {
            this.parsePropertyName(node)
          }
          if ((node.key.type === "Identifier" && node.key.name === "constructor") ||
              (node.key.type === "Literal" && node.key.value === "constructor")) {
            this.raise(node.key.start, "Classes may not have a field called constructor")
          }
          this.enterScope(64 | 2 | 1) // See acorn's scopeflags.js
          this._maybeParseFieldValue(node)
          this.exitScope()
          this.finishNode(node, "FieldDefinition")
          this.semicolon()
          return node
        }
      }

      return super.parseClassElement.apply(this, arguments)
    }

    // Prohibit arguments in class field initializers
    parseIdent(liberal, isBinding) {
      const ident = super.parseIdent(liberal, isBinding)
      if (this._inFieldValue && ident.name == "arguments") this.raise(ident.start, "A class field initializer may not contain arguments")
      return ident
    }
  }
}
