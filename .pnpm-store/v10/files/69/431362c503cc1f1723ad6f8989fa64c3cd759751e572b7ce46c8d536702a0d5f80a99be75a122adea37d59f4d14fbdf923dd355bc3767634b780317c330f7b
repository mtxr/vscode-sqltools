"use strict"

const assert = require("assert")
const acorn = require("acorn"), classFields = require("..")
const Parser = acorn.Parser.extend(classFields)

function test(text, expectedResult, additionalOptions) {
  it(text, function () {
    const result = Parser.parse(text, Object.assign({ ecmaVersion: 9, allowAwaitOutsideFunction: true }, additionalOptions))
    if (expectedResult) {
      assert.deepStrictEqual(result.body[0], expectedResult)
    }
  })
}
function testFail(text, expectedResult, additionalOptions) {
  it(text, function () {
    let msg = null
    try {
      Parser.parse(text, Object.assign({ ecmaVersion: 9 }, additionalOptions))
    } catch (e) {
      msg = e.message
    }
    assert.strictEqual(msg, expectedResult)
  })
}
const newNode = (start, props) => Object.assign(new acorn.Node({options: {}}, start), props)

describe("acorn-class-fields", function () {
  test(`class P extends Q {
    x = super.x
  }`)

  test(`class Counter extends HTMLElement {
    x = 0;

    clicked() {
      this.x++;
    }

    render() {
      return this.x.toString();
    }
  }`)

  test(`
    class AsyncIterPipe{
      static get [ Symbol.species](){
        return Promise
      }
      static get Closing(){
        return Closing
      }
      static get controllerSignals(){ return controllerSignals}
      static get listenerBinding(){ return listenerBinding}

      // state
      done= false
    }
  `)

  test(`
    class Class {
      value = await getValue();
    }
  `)

  test(`class Counter extends HTMLElement {
    #x = 0;

    clicked() {
      this.#x++;
    }

    render() {
      return this.#x.toString();
    }
  }`)
  test("class A { a = this.#a; #a = 4 }")

  test("class A { 5 = 5; #5 = 5 }")
  test("class A { delete = 5; #delete = 5 }")

  testFail("class A { #a; f() { delete this.#a } }", "Private elements may not be deleted (1:20)")
  testFail("class A { #a; #a }", "Duplicate private element (1:14)")
  testFail("class A { a = this.#a }", "Usage of undeclared private name (1:19)")
  testFail("class A { a = this.#a; b = this.#b }", "Usage of undeclared private name (1:19)")
  testFail("class A { constructor = 4 }", "Classes may not have a field called constructor (1:10)")
  testFail("class A { #constructor = 4 }", "Classes may not have a private element named constructor (1:10)")
  testFail("class A { a = () => arguments }", "A class field initializer may not contain arguments (1:20)")
  testFail("class A { a = () => super() }", "super() call outside constructor of a subclass (1:20)")
  testFail("class A { # a }", "Unexpected token (1:10)")
  testFail("class A { #a; a() { this.# a } }", "Unexpected token (1:27)")

  const classes = [
    { text: "class A { %s }", ast: getBody => {
      const body = getBody(10)
      return newNode(0, {
        type: "ClassDeclaration",
        end: body.end + 2,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: body.end + 2,
          body: [body]
        })
      })
    } },
    { text: "class A { %s; }", ast: getBody => {
      const body = getBody(10)
      return newNode(0, {
        type: "ClassDeclaration",
        end: body.end + 3,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: body.end + 3,
          body: [body]
        })
      })
    } },
    { text: "class A { %s; #y }", ast: getBody => {
      const body = getBody(10)
      return newNode(0, {
        type: "ClassDeclaration",
        end: body.end + 6,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: body.end + 6,
          body: [body, newNode(body.end + 2, {
            type: "FieldDefinition",
            end: body.end + 4,
            key: newNode(body.end + 2, {
              type: "PrivateName",
              end: body.end + 4,
              name: "y"
            }),
            value: null,
            computed: false
          }) ]
        })
      })
    } },
    { text: "class A { %s;a() {} }", ast: getBody => {
      const body = getBody(10)
      return newNode(0, {
        type: "ClassDeclaration",
        end: body.end + 9,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: body.end + 9,
          body: [ body, newNode(body.end + 1, {
            type: "MethodDefinition",
            end: body.end + 7,
            kind: "method",
            static: false,
            computed: false,
            key: newNode(body.end + 1, {
              type: "Identifier",
              end: body.end + 2,
              name: "a"
            }),
            value: newNode(body.end + 2, {
              type: "FunctionExpression",
              end: body.end + 7,
              id: null,
              generator: false,
              expression: false,
              async: false,
              params: [],
              body: newNode(body.end + 5, {
                type: "BlockStatement",
                end: body.end + 7,
                body: []
              })
            })
          }) ]
        })
      })
    } },
    { text: "class A { %s\na() {} }", ast: getBody => {
      const body = getBody(10)
      return newNode(0, {
        type: "ClassDeclaration",
        end: body.end + 9,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: body.end + 9,
          body: [
            body,
            newNode(body.end + 1, {
              type: "MethodDefinition",
              end: body.end + 7,
              kind: "method",
              static: false,
              computed: false,
              key: newNode(body.end + 1, {
                type: "Identifier",
                end: body.end + 2,
                name: "a"
              }),
              value: newNode(body.end + 2, {
                type: "FunctionExpression",
                end: body.end + 7,
                id: null,
                generator: false,
                expression: false,
                async: false,
                params: [],
                body: newNode(body.end + 5, {
                  type: "BlockStatement",
                  end: body.end + 7,
                  body: []
                })
              })
            })
          ]
        })
      })
    } },
  ];

  [
    { body: "x", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 1,
      key: newNode(start, {
        type: "Identifier",
        end: start + 1,
        name: "x"
      }),
      value: null,
      computed: false
    }) },
    { body: "x = 0", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 5,
      key: newNode(start, {
        type: "Identifier",
        end: start + 1,
        name: "x"
      }),
      value: newNode(start + 4, {
        type: "Literal",
        end: start + 5,
        value: 0,
        raw: "0"
      }),
      computed: false
    }) },
    { body: "[x]", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 3,
      computed: true,
      key: newNode(start + 1, {
        type: "Identifier",
        end: start + 2,
        name: "x"
      }),
      value: null
    }) },
    { body: "[x] = 0", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 7,
      computed: true,
      key: newNode(start + 1, {
        type: "Identifier",
        end: start + 2,
        name: "x"
      }),
      value: newNode(start + 6, {
        type: "Literal",
        end: start + 7,
        value: 0,
        raw: "0"
      })
    }) },
    { body: "#x", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 2,
      computed: false,
      key: newNode(start, {
        type: "PrivateName",
        end: start + 2,
        name: "x"
      }),
      value: null,
    }) },
    { body: "#x = 0", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 6,
      computed: false,
      key: newNode(start, {
        type: "PrivateName",
        end: start + 2,
        name: "x"
      }),
      value: newNode(start + 5, {
        type: "Literal",
        end: start + 6,
        value: 0,
        raw: "0"
      })
    }) },

    { body: "async", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 5,
      key: newNode(start, {
        type: "Identifier",
        end: start + 5,
        name: "async"
      }),
      value: null,
      computed: false
    }) },

    { body: "async = 5", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 9,
      key: newNode(start, {
        type: "Identifier",
        end: start + 5,
        name: "async"
      }),
      value: newNode(start + 8, {
        type: "Literal",
        end: start + 9,
        raw: "5",
        value: 5
      }),
      computed: false
    }) },
  ].forEach(bodyInput => {
    const body = bodyInput.body, passes = bodyInput.passes, bodyAst = bodyInput.ast
    classes.forEach(input => {
      const text = input.text, options = input.options || {}, ast = input.ast;
      (passes ? test : testFail)(text.replace("%s", body), ast(bodyAst), options)
    })
  })

  testFail("class C { \\u0061sync m(){} };", "Unexpected token (1:21)")
  test("class A extends B { constructor() { super() } }")
  test("var C = class { bre\\u0061k() { return 42; }}")
  test(`class X {
      x
      () {}
  }`)
  test(`class X {
      static x
      () {}
  }`)
  test(`class X {
      get
      y() {}
  }`)
  test(`class X {
      static;
      async;
      y() {}
  }`)
})
