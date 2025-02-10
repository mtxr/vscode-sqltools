"use strict"

const assert = require("assert")
const acorn = require("acorn")
const Parser = acorn.Parser.extend(require(".."))

function test(text, expectedResult, additionalOptions) {
  it(text, function () {
    const result = Parser.parse(text, Object.assign({ ecmaVersion: 10 }, additionalOptions))
    if (expectedResult) {
      assert.deepStrictEqual(result.body[0], expectedResult)
    }
  })
}
function testFail(text, expectedResult, additionalOptions) {
  it(text, function () {
    let failed = false
    try {
      Parser.parse(text, Object.assign({ ecmaVersion: 10 }, additionalOptions))
    } catch (e) {
      assert.strictEqual(e.message, expectedResult)
      failed = true
    }
    assert(failed)
  })
}
const newNode = (start, props) => Object.assign(new acorn.Node({options: {}}, start), props)

describe("acorn-static-class-features", function () {
  test(`class CustomDate {
    // ...
    static epoch = new CustomDate(0);
  }`)

  testFail("class A { static #a; f() { delete A.#a } }", "Private elements may not be deleted (1:27)")
  testFail("class A { static #a; static #a }", "Duplicate private element (1:21)")
  testFail("class A { static a = A.#a }", "Usage of undeclared private name (1:23)")
  testFail("class A { static a = () => arguments }", "A static class field initializer may not contain arguments (1:27)")
  testFail("class A { static a = () => super() }", "super() call outside constructor of a subclass (1:27)")
  testFail("class A { static # a }", "Unexpected token (1:19)")
  testFail("class A { static #a; a() { A.# a } }", "Unexpected token (1:31)")
  test(`class C {
    static async * #method() {
    }
  }`)
  test(`class C {
    static a = () => {
      function p () {
        console.log(arguments);
      }
    }
  }`)

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
    { text: "class A { %s; static #y }", ast: getBody => {
      const body = getBody(10)
      return newNode(0, {
        type: "ClassDeclaration",
        end: body.end + 13,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: body.end + 13,
          body: [body, newNode(body.end + 2, {
            type: "FieldDefinition",
            end: body.end + 11,
            key: newNode(body.end + 9, {
              type: "PrivateName",
              end: body.end + 11,
              name: "y"
            }),
            value: null,
            computed: false,
            static: true
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
  ]

  ;[
    { body: "static x", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 8,
      key: newNode(start + 7, {
        type: "Identifier",
        end: start + 8,
        name: "x"
      }),
      value: null,
      computed: false,
      static: true
    }) },
    { body: "static x = 0", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 12,
      key: newNode(start + 7, {
        type: "Identifier",
        end: start + 8,
        name: "x"
      }),
      value: newNode(start + 11, {
        type: "Literal",
        end: start + 12,
        value: 0,
        raw: "0"
      }),
      computed: false,
      static: true
    }) },
    { body: "static [x]", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 10,
      computed: true,
      key: newNode(start + 8, {
        type: "Identifier",
        end: start + 9,
        name: "x"
      }),
      value: null,
      static: true
    }) },
    { body: "static [x] = 0", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 14,
      computed: true,
      key: newNode(start + 8, {
        type: "Identifier",
        end: start + 9,
        name: "x"
      }),
      value: newNode(start + 13, {
        type: "Literal",
        end: start + 14,
        value: 0,
        raw: "0"
      }),
      static: true
    }) },
    { body: "static #x", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 9,
      computed: false,
      key: newNode(start + 7, {
        type: "PrivateName",
        end: start + 9,
        name: "x"
      }),
      value: null,
      static: true
    }) },
    { body: "static #x = 0", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 13,
      computed: false,
      key: newNode(start + 7, {
        type: "PrivateName",
        end: start + 9,
        name: "x"
      }),
      value: newNode(start + 12, {
        type: "Literal",
        end: start + 13,
        value: 0,
        raw: "0"
      }),
      static: true
    }) },

    { body: "static async", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 12,
      key: newNode(start + 7, {
        type: "Identifier",
        end: start + 12,
        name: "async"
      }),
      value: null,
      computed: false,
      static: true
    }) },

    { body: "static async = 5", passes: true, ast: start => newNode(start, {
      type: "FieldDefinition",
      end: start + 16,
      key: newNode(start + 7, {
        type: "Identifier",
        end: start + 12,
        name: "async"
      }),
      value: newNode(start + 15, {
        type: "Literal",
        end: start + 16,
        raw: "5",
        value: 5
      }),
      computed: false,
      static: true
    }) },
  ].forEach(bodyInput => {
    const body = bodyInput.body, passes = bodyInput.passes, bodyAst = bodyInput.ast
    classes.forEach(input => {
      const text = input.text, options = input.options || {}, ast = input.ast
      ;(passes ? test : testFail)(text.replace("%s", body), ast(bodyAst), options)
    })
  })

  // Private static methods
  test("class A { a() { A.#a }; static #a() {} }")

  testFail("class A { static #a() {}; f() { delete A.#a } }", "Private elements may not be deleted (1:32)")
  testFail("class A { static #a() {}; static #a() {} }", "Duplicate private element (1:26)")
  test("class A { static get #a() {}; static set #a(newA) {} }")
  testFail("class A { a() { A.#a } }", "Usage of undeclared private name (1:18)")
  testFail("class A { a() { A.#a } b() { A.#b } }", "Usage of undeclared private name (1:18)")
  testFail("class A { static #constructor() {} }", "Classes may not have a private element named constructor (1:17)")
  testFail("class A { static #[ab]() {} }", "Unexpected token (1:18)")
  testFail("a = { static #ab() {} }", "Unexpected token (1:13)")
  testFail("class A { static [{#ab() {}}]() {} }", "Unexpected token (1:19)")
  testFail("class A{ static # a() {}}", "Unexpected token (1:18)")
  testFail("class C{ static #method() { super(); } };", "super() call outside constructor of a subclass (1:28)")
  test("class C{ static #method() { super.y(); } };")

  ;[
    { body: "static #x() {}", passes: true, ast: start => newNode(start, {
      type: "MethodDefinition",
      end: start + 14,
      computed: false,
      key: newNode(start + 7, {
        type: "PrivateName",
        end: start + 9,
        name: "x"
      }),
      kind: "method",
      static: true,
      value: newNode(start + 9, {
        type: "FunctionExpression",
        end: start + 14,
        async: false,
        body: newNode(start + 12, {
          type: "BlockStatement",
          body: [],
          end: start + 14,
        }),
        expression: false,
        generator: false,
        id: null,
        params: [],
      })
    }) },
    { body: "static get #x() {}", passes: true, ast: start => newNode(start, {
      type: "MethodDefinition",
      end: start + 18,
      computed: false,
      key: newNode(start + 11, {
        type: "PrivateName",
        end: start + 13,
        name: "x"
      }),
      kind: "get",
      static: true,
      value: newNode(start + 13, {
        type: "FunctionExpression",
        end: start + 18,
        async: false,
        body: newNode(start + 16, {
          body: [],
          end: start + 18,
          type: "BlockStatement"
        }),
        expression: false,
        generator: false,
        id: null,
        params: [],
      })
    }) },

  ].forEach(bodyInput => {
    const body = bodyInput.body, passes = bodyInput.passes, bodyAst = bodyInput.ast
    classes.forEach(input => {
      const text = input.text, options = input.options || {}, ast = input.ast
      ;(passes ? test : testFail)(text.replace("%s", body), ast(bodyAst), options)
    })
  })
  test("class A extends B { constructor() { super() } }")
  test(`class C {
    static f = 'test262';
    static 'g';
    static 0 = 'bar';
    static [computed];
  }`)
  test("class X{static delete}")
  test(`class Foo extends Bar {
  static field = super.field + 1;
}`)
})
