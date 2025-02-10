"use strict"

const assert = require("assert")

const acorn = require("acorn")
const stage3 = require("..")

const Parser = acorn.Parser.extend(stage3)

const parse = testCode => Parser.parse(testCode, { ecmaVersion: 12, sourceType: "module" })

function test(testCode, ast) {
  it(testCode, () => {
    const result = parse(testCode)
    assert.deepStrictEqual(result, ast)
  })
}
function testFail(text, expectedError, additionalOptions) {
  it(text, function () {
    let failed = false
    try {
      Parser.parse(text, Object.assign({ ecmaVersion: 12, additionalOptions }))
    } catch (e) {
      assert.strictEqual(e.message, expectedError)
      failed = true
    }
    assert(failed)
  })
}

const newNode = (start, props) => Object.assign(new acorn.Node({options: {}}, start), props)
const newBigIntLiteral = (start, stringValue, raw) => newNode(start, {
  type: "Literal",
  end: start + raw.length + 1,
  // eslint-disable-next-line node/no-unsupported-features/es-builtins
  value: typeof BigInt !== "undefined" ? BigInt(stringValue) : null,
  raw: `${raw}n`,
  bigint: stringValue
})

describe("acorn-stage3", () => {
  it("Doesn't break check for comma after rest element", () => {
    assert.throws(() => parse("0, {...rest, b} = {}"))
  })

  const testCode = `async function* xxyz() {
    let value = 1_000_000n + 0xdead_beefn
    for await (const { a, ...y } of z) {
      import(import.meta.resolve(a).replace(/.css$/, ".js")).then(({ interestingThing, ...otherStuff }) => {
        const data = { ...y, ...otherStuff }
      });
    }

    try {
      BigInt.method()
    } catch {}

    class A {
      #a = 5_5n;
      #getA() { return this.#a * 5 }
    }
  }`

  const ast = newNode(0, {
    type: "Program",
    end: 404,
    body: [
      newNode(0, {
        type: "FunctionDeclaration",
        end: 404,
        id: newNode(16, {
          type: "Identifier",
          end: 20,
          name: "xxyz"
        }),
        generator: true,
        expression: false,
        async: true,
        params: [],
        body: newNode(23, {
          type: "BlockStatement",
          end: 404,
          body: [
            newNode(29, {
              type: "VariableDeclaration",
              end: 66,
              declarations: [
                newNode(33, {
                  type: "VariableDeclarator",
                  end: 66,
                  id: newNode(33, {
                    type: "Identifier",
                    end: 38,
                    name: "value"
                  }),
                  init: newNode(41, {
                    type: "BinaryExpression",
                    end: 66,
                    left: newBigIntLiteral(41, "1000000", "1_000_000"),
                    operator: "+",
                    right: newBigIntLiteral(54, "0xdeadbeef", "0xdead_beef"),
                  })
                })
              ],
              kind: "let"
            }),
            newNode(71, {
              type: "ForOfStatement",
              end: 277,
              await: true,
              left: newNode(82, {
                type: "VariableDeclaration",
                end: 99,
                declarations: [
                  newNode(88, {
                    type: "VariableDeclarator",
                    end: 99,
                    id: newNode(88, {
                      type: "ObjectPattern",
                      end: 99,
                      properties: [
                        newNode(90, {
                          type: "Property",
                          end: 91,
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: newNode(90, {
                            type: "Identifier",
                            end: 91,
                            name: "a"
                          }),
                          kind: "init",
                          value: newNode(90, {
                            type: "Identifier",
                            end: 91,
                            name: "a"
                          })
                        }),
                        newNode(93, {
                          type: "RestElement",
                          end: 97,
                          argument: newNode(96, {
                            type: "Identifier",
                            end: 97,
                            name: "y"
                          })
                        })
                      ]
                    }),
                    init: null
                  })
                ],
                kind: "const"
              }),
              right: newNode(103, {
                type: "Identifier",
                end: 104,
                name: "z"
              }),
              body: newNode(106, {
                type: "BlockStatement",
                end: 277,
                body: [
                  newNode(114, {
                    type: "ExpressionStatement",
                    end: 271,
                    expression: newNode(114, {
                      type: "CallExpression",
                      end: 270,
                      optional: false,
                      callee: newNode(114, {
                        type: "MemberExpression",
                        end: 173,
                        optional: false,
                        object: newNode(114, {
                          type: "ImportExpression",
                          end: 168,
                          source: newNode(121, {
                            type: "CallExpression",
                            end: 167,
                            optional: false,
                            callee: newNode(121, {
                              type: "MemberExpression",
                              end: 151,
                              optional: false,
                              object: newNode(121, {
                                type: "CallExpression",
                                end: 143,
                                optional: false,
                                callee: newNode(121, {
                                  type: "MemberExpression",
                                  end: 140,
                                  optional: false,
                                  object: newNode(121, {
                                    type: "MetaProperty",
                                    end: 132,
                                    meta: newNode(121, {
                                      type: "Identifier",
                                      end: 127,
                                      name: "import"
                                    }),
                                    property: newNode(128, {
                                      type: "Identifier",
                                      end: 132,
                                      name: "meta"
                                    })
                                  }),
                                  property: newNode(133, {
                                    type: "Identifier",
                                    end: 140,
                                    name: "resolve"
                                  }),
                                  computed: false
                                }),
                                arguments: [
                                  newNode(141, {
                                    type: "Identifier",
                                    end: 142,
                                    name: "a"
                                  })
                                ]
                              }),
                              property: newNode(144, {
                                type: "Identifier",
                                end: 151,
                                name: "replace"
                              }),
                              computed: false
                            }),
                            arguments: [
                              newNode(152, {
                                type: "Literal",
                                end: 159,
                                raw: "/.css$/",
                                regex: {
                                  pattern: ".css$",
                                  flags: ""
                                },
                                value: /.css$/
                              }),
                              newNode(161, {
                                type: "Literal",
                                end: 166,
                                value: ".js",
                                raw: "\".js\""
                              })
                            ]
                          })
                        }),
                        property: newNode(169, {
                          type: "Identifier",
                          end: 173,
                          name: "then"
                        }),
                        computed: false
                      }),
                      arguments: [
                        newNode(174, {
                          type: "ArrowFunctionExpression",
                          end: 269,
                          id: null,
                          generator: false,
                          expression: false,
                          async: false,
                          params: [
                            newNode(175, {
                              type: "ObjectPattern",
                              end: 210,
                              properties: [
                                newNode(177, {
                                  type: "Property",
                                  end: 193,
                                  method: false,
                                  shorthand: true,
                                  computed: false,
                                  key: newNode(177, {
                                    type: "Identifier",
                                    end: 193,
                                    name: "interestingThing"
                                  }),
                                  kind: "init",
                                  value: newNode(177, {
                                    type: "Identifier",
                                    end: 193,
                                    name: "interestingThing"
                                  })
                                }),
                                newNode(195, {
                                  type: "RestElement",
                                  end: 208,
                                  argument: newNode(198, {
                                    type: "Identifier",
                                    end: 208,
                                    name: "otherStuff"
                                  })
                                })
                              ]
                            })
                          ],
                          body: newNode(215, {
                            type: "BlockStatement",
                            end: 269,
                            body: [
                              newNode(225, {
                                type: "VariableDeclaration",
                                end: 261,
                                declarations: [
                                  newNode(231, {
                                    type: "VariableDeclarator",
                                    end: 261,
                                    id: newNode(231, {
                                      type: "Identifier",
                                      end: 235,
                                      name: "data"
                                    }),
                                    init: newNode(238, {
                                      type: "ObjectExpression",
                                      end: 261,
                                      properties: [
                                        newNode(240, {
                                          type: "SpreadElement",
                                          end: 244,
                                          argument: newNode(243, {
                                            type: "Identifier",
                                            end: 244,
                                            name: "y"
                                          })
                                        }),
                                        newNode(246, {
                                          type: "SpreadElement",
                                          end: 259,
                                          argument: newNode(249, {
                                            type: "Identifier",
                                            end: 259,
                                            name: "otherStuff"
                                          })
                                        })
                                      ]
                                    })
                                  })
                                ],
                                kind: "const"
                              })
                            ]
                          })
                        })
                      ]
                    })
                  })
                ]
              })
            }),
            newNode(283, {
              type: "TryStatement",
              end: 325,
              block: newNode(287, {
                type: "BlockStatement",
                end: 316,
                body: [
                  newNode(295, {
                    type: "ExpressionStatement",
                    end: 310,
                    expression: newNode(295, {
                      type: "CallExpression",
                      end: 310,
                      optional: false,
                      callee: newNode(295, {
                        type: "MemberExpression",
                        end: 308,
                        optional: false,
                        object: newNode(295, {
                          type: "Identifier",
                          end: 301,
                          name: "BigInt"
                        }),
                        property: newNode(302, {
                          type: "Identifier",
                          end: 308,
                          name: "method"
                        }),
                        computed: false
                      }),
                      arguments: []
                    })
                  })
                ]
              }),
              handler: newNode(317, {
                type: "CatchClause",
                end: 325,
                param: null,
                body: newNode(323, {
                  type: "BlockStatement",
                  end: 325,
                  body: []
                })
              }),
              finalizer: null
            }),
            newNode(331, {
              type: "ClassDeclaration",
              end: 400,
              id: newNode(337, {
                type: "Identifier",
                end: 338,
                name: "A"
              }),
              superClass: null,
              body: newNode(339, {
                type: "ClassBody",
                end: 400,
                body: [
                  newNode(347, {
                    type: "FieldDefinition",
                    end: 356,
                    computed: false,
                    key: newNode(347, {
                      type: "PrivateName",
                      end: 349,
                      name: "a"
                    }),
                    value: newBigIntLiteral(352, "55", "5_5")
                  }),
                  newNode(364, {
                    type: "MethodDefinition",
                    end: 394,
                    kind: "method",
                    static: false,
                    computed: false,
                    key: newNode(364, {
                      type: "PrivateName",
                      end: 369,
                      name: "getA"
                    }),
                    value: newNode(369, {
                      type: "FunctionExpression",
                      end: 394,
                      id: null,
                      generator: false,
                      expression: false,
                      async: false,
                      params: [],
                      body: newNode(372, {
                        type: "BlockStatement",
                        end: 394,
                        body: [
                          newNode(374, {
                            type: "ReturnStatement",
                            end: 392,
                            argument: newNode(381, {
                              type: "BinaryExpression",
                              end: 392,
                              left: newNode(381, {
                                type: "MemberExpression",
                                end: 388,
                                optional: false,
                                object: newNode(381, {
                                  type: "ThisExpression",
                                  end: 385
                                }),
                                property: newNode(386, {
                                  type: "PrivateName",
                                  end: 388,
                                  name: "a"
                                }),
                                computed: false
                              }),
                              operator: "*",
                              right: newNode(391, {
                                type: "Literal",
                                end: 392,
                                value: 5,
                                raw: "5"
                              })
                            })
                          })
                        ]
                      })
                    })
                  })
                ]
              })
            })
          ]
        })
      })
    ],
    sourceType: "module"
  })
  test(testCode, ast)

  test("import('a').then(() => {import.meta.hooray()})", newNode(0, {
    type: "Program",
    end: 46,
    body: [
      newNode(0, {
        type: "ExpressionStatement",
        end: 46,
        expression: newNode(0, {
          type: "CallExpression",
          end: 46,
          optional: false,
          callee: newNode(0, {
            type: "MemberExpression",
            end: 16,
            optional: false,
            object: newNode(0, {
              type: "ImportExpression",
              end: 11,
              source: newNode(7, {
                type: "Literal",
                end: 10,
                value: "a",
                raw: "'a'"
              })
            }),
            property: newNode(12, {
              type: "Identifier",
              end: 16,
              name: "then"
            }),
            computed: false
          }),
          arguments: [
            newNode(17, {
              type: "ArrowFunctionExpression",
              end: 45,
              id: null,
              generator: false,
              expression: false,
              async: false,
              params: [],
              body: newNode(23, {
                type: "BlockStatement",
                end: 45,
                body: [
                  newNode(24, {
                    type: "ExpressionStatement",
                    end: 44,
                    expression: newNode(24, {
                      type: "CallExpression",
                      end: 44,
                      optional: false,
                      callee: newNode(24, {
                        type: "MemberExpression",
                        end: 42,
                        optional: false,
                        object: newNode(24, {
                          type: "MetaProperty",
                          end: 35,
                          meta: newNode(24, {
                            type: "Identifier",
                            end: 30,
                            name: "import"
                          }),
                          property: newNode(31, {
                            type: "Identifier",
                            end: 35,
                            name: "meta"
                          })
                        }),
                        property: newNode(36, {
                          type: "Identifier",
                          end: 42,
                          name: "hooray"
                        }),
                        computed: false
                      }),
                      arguments: []
                    })
                  })
                ]
              })
            })
          ]
        })
      })
    ],
    sourceType: "module"
  }))

  test(`class A {
    #secret = this.#default
    #default = "defau\u2028\u2029"

    #getSecret() { return this.#secret }

    getSecretProvider() {
      return new (class {
        #secret
        constructor(secret) {
          this.#secret = secret
        }
      })(this.#getSecret())
    }
  }`, newNode(0, {
    type: "Program",
    end: 283,
    body: [
      newNode(0, {
        type: "ClassDeclaration",
        end: 283,
        id: newNode(6, {
          type: "Identifier",
          end: 7,
          name: "A"
        }),
        superClass: null,
        body: newNode(8, {
          type: "ClassBody",
          end: 283,
          body: [
            newNode(14, {
              type: "FieldDefinition",
              end: 37,
              computed: false,
              key: newNode(14, {
                type: "PrivateName",
                end: 21,
                name: "secret"
              }),
              value: newNode(24, {
                type: "MemberExpression",
                end: 37,
                optional: false,
                object: newNode(24, {
                  type: "ThisExpression",
                  end: 28
                }),
                property: newNode(29, {
                  type: "PrivateName",
                  end: 37,
                  name: "default"
                }),
                computed: false
              })
            }),
            newNode(42, {
              type: "FieldDefinition",
              end: 62,
              computed: false,
              key: newNode(42, {
                type: "PrivateName",
                end: 50,
                name: "default"
              }),
              value: newNode(53, {
                type: "Literal",
                end: 62,
                value: "defau\u2028\u2029",
                raw: "\"defau\u2028\u2029\""
              })
            }),
            newNode(68, {
              type: "MethodDefinition",
              end: 104,
              kind: "method",
              static: false,
              computed: false,
              key: newNode(68, {
                type: "PrivateName",
                end: 78,
                name: "getSecret"
              }),
              value: newNode(78, {
                type: "FunctionExpression",
                end: 104,
                id: null,
                generator: false,
                expression: false,
                async: false,
                params: [],
                body: newNode(81, {
                  type: "BlockStatement",
                  end: 104,
                  body: [
                    newNode(83, {
                      type: "ReturnStatement",
                      end: 102,
                      argument: newNode(90, {
                        type: "MemberExpression",
                        end: 102,
                        optional: false,
                        object: newNode(90, {
                          type: "ThisExpression",
                          end: 94
                        }),
                        property: newNode(95, {
                          type: "PrivateName",
                          end: 102,
                          name: "secret"
                        }),
                        computed: false
                      })
                    })
                  ]
                })
              })
            }),
            newNode(110, {
              type: "MethodDefinition",
              end: 279,
              kind: "method",
              static: false,
              computed: false,
              key: newNode(110, {
                type: "Identifier",
                end: 127,
                name: "getSecretProvider"
              }),
              value: newNode(127, {
                type: "FunctionExpression",
                end: 279,
                id: null,
                generator: false,
                expression: false,
                async: false,
                params: [],
                body: newNode(130, {
                  type: "BlockStatement",
                  end: 279,
                  body: [
                    newNode(138, {
                      type: "ReturnStatement",
                      end: 273,
                      argument: newNode(145, {
                        type: "NewExpression",
                        end: 273,
                        callee: newNode(150, {
                          type: "ClassExpression",
                          end: 253,
                          id: null,
                          superClass: null,
                          body: newNode(156, {
                            type: "ClassBody",
                            end: 253,
                            body: [
                              newNode(166, {
                                type: "FieldDefinition",
                                end: 173,
                                computed: false,
                                key: newNode(166, {
                                  type: "PrivateName",
                                  end: 173,
                                  name: "secret"
                                }),
                                value: null
                              }),
                              newNode(182, {
                                type: "MethodDefinition",
                                end: 245,
                                kind: "constructor",
                                static: false,
                                computed: false,
                                key: newNode(182, {
                                  type: "Identifier",
                                  end: 193,
                                  name: "constructor"
                                }),
                                value: newNode(193, {
                                  type: "FunctionExpression",
                                  end: 245,
                                  id: null,
                                  generator: false,
                                  expression: false,
                                  async: false,
                                  params: [
                                    newNode(194, {
                                      type: "Identifier",
                                      end: 200,
                                      name: "secret"
                                    })
                                  ],
                                  body: newNode(202, {
                                    type: "BlockStatement",
                                    end: 245,
                                    body: [
                                      newNode(214, {
                                        type: "ExpressionStatement",
                                        end: 235,
                                        expression: newNode(214, {
                                          type: "AssignmentExpression",
                                          end: 235,
                                          operator: "=",
                                          left: newNode(214, {
                                            type: "MemberExpression",
                                            end: 226,
                                            optional: false,
                                            object: newNode(214, {
                                              type: "ThisExpression",
                                              end: 218
                                            }),
                                            property: newNode(219, {
                                              type: "PrivateName",
                                              end: 226,
                                              name: "secret"
                                            }),
                                            computed: false
                                          }),
                                          right: newNode(229, {
                                            type: "Identifier",
                                            end: 235,
                                            name: "secret"
                                          })
                                        })
                                      })
                                    ]
                                  })
                                })
                              })
                            ]
                          })
                        }),
                        arguments: [
                          newNode(255, {
                            type: "CallExpression",
                            end: 272,
                            optional: false,
                            callee: newNode(255, {
                              type: "MemberExpression",
                              end: 270,
                              optional: false,
                              object: newNode(255, {
                                type: "ThisExpression",
                                end: 259
                              }),
                              property: newNode(260, {
                                type: "PrivateName",
                                end: 270,
                                name: "getSecret"
                              }),
                              computed: false
                            }),
                            arguments: []
                          })
                        ]
                      })
                    })
                  ]
                })
              })
            })
          ]
        })
      })
    ],
    sourceType: "module"
  }))
  /* eslint-disable */
  testFail(`class Example {
    static #x = 1;
    #x = 2; // SyntaxError ("Duplicate private field")

    method() {
        console.log(` + "`Example.#x = ${Example.#x}`" + `);
        console.log(` + "`this.#x = ${this.#x}`" + `);
    }
  }`, "Duplicate private element (3:4)")
  /* eslint-enable */
})
