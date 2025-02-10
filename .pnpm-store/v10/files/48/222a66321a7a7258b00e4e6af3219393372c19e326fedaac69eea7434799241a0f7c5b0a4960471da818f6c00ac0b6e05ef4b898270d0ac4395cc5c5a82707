"use strict"

const assert = require("assert")
const acorn = require("acorn")
const privateMethods = require("..")
const Parser = acorn.Parser.extend(privateMethods)

function test(text, expectedResult, additionalOptions) {
  it(text, function () {
    const result = Parser.parse(text, Object.assign({ ecmaVersion: 9 }, additionalOptions))
    if (expectedResult) assert.deepStrictEqual(result.body[0], expectedResult)
  })
}
function testFail(text, expectedError, additionalOptions) {
  it(text, function () {
    let failed = false
    try {
      Parser.parse(text, Object.assign({ ecmaVersion: 9, plugins: { privateMethods: true } }, additionalOptions))
    } catch (e) {
      assert.strictEqual(e.message, expectedError)
      failed = true
    }
    assert(failed)
  })
}

const newNode = (start, props) => Object.assign(new acorn.Node({options: {}}, start), props)
describe("acorn-private-methods", function () {
  test("class A { a() { this.#a }; #a() {} }")
  test(`var C = class {
  #m() { return 42; }
  constructor() {
    (() => this)().#m
  }
}`)

  testFail("class A { #a() {}; f() { delete this.#a } }", "Private elements may not be deleted (1:25)")
  testFail("class A { #a() {}; #a() {} }", "Duplicate private element (1:19)")
  test("class A { get #a() {}; set #a(newA) {} }")
  testFail("class A { a() { this.#a } }", "Usage of undeclared private name (1:21)")
  testFail("class A { a() { this.#a } b() { this.#b } }", "Usage of undeclared private name (1:21)")
  testFail("class A { #constructor() {} }", "Classes may not have a private element named constructor (1:10)")
  testFail("class A { #[ab]() {} }", "Unexpected token (1:11)")
  testFail("a = { #ab() {} }", "Unexpected token (1:6)")
  testFail("class A { [{#ab() {}}]() {} }", "Unexpected token (1:12)")
  testFail("class A{ # a() {}}", "Unexpected token (1:11)")
  testFail("class C{ #method() { super(); } };", "super() call outside constructor of a subclass (1:21)")
  test("class C{ #method() { super.y(); } };")

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
    { text: "class A { %s; #y() {} }", ast: getBody => {
      const body = getBody(10)
      return newNode(0, {
        type: "ClassDeclaration",
        end: body.end + 11,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: body.end + 11,
          body: [body, newNode(body.end + 2, {
            type: "MethodDefinition",
            end: body.end + 9,
            kind: "method",
            static: false,
            computed: false,
            key: newNode(body.end + 2, {
              type: "PrivateName",
              end: body.end + 4,
              name: "y"
            }),
            value: newNode(body.end + 4, {
              type: "FunctionExpression",
              end: body.end + 9,
              id: null,
              generator: false,
              expression: false,
              async: false,
              params: [],
              body: newNode(body.end + 7, {
                type: "BlockStatement",
                end: body.end + 9,
                body: []
              })
            })
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
    { body: "#x() {}", passes: true, ast: start => newNode(start, {
      type: "MethodDefinition",
      end: start + 7,
      computed: false,
      key: newNode(start, {
        type: "PrivateName",
        end: start + 2,
        name: "x"
      }),
      kind: "method",
      static: false,
      value: newNode(start + 2, {
        type: "FunctionExpression",
        end: start + 7,
        async: false,
        body: newNode(start + 5, {
          type: "BlockStatement",
          body: [],
          end: start + 7,
        }),
        expression: false,
        generator: false,
        id: null,
        params: [],
      })
    }) },
    { body: "get #x() {}", passes: true, ast: start => newNode(start, {
      type: "MethodDefinition",
      end: start + 11,
      computed: false,
      key: newNode(start + 4, {
        type: "PrivateName",
        end: start + 6,
        name: "x"
      }),
      kind: "get",
      static: false,
      value: newNode(start + 6, {
        type: "FunctionExpression",
        end: start + 11,
        async: false,
        body: newNode(start + 9, {
          body: [],
          end: start + 11,
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
      const text = input.text, options = input.options || {}, ast = input.ast;
      (passes ? test : testFail)(text.replace("%s", body), ast(bodyAst), options)
    })
  })

  testFail("class C { \\u0061sync m(){} };", "Unexpected token (1:21)")
  test("class A extends B { constructor() { super() } }")
  testFail("class X { static #private() {} }", "Unexpected token (1:17)")
})
