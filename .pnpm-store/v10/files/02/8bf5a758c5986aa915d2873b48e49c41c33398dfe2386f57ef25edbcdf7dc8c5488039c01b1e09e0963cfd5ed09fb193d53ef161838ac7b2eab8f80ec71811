"use strict"

const assert = require("assert")
const acorn = require("acorn")
const privateClassElements = require("..")

describe("acorn-private-class-elements", () => {
  it("does not inject itself twice", () => {
    const first = privateClassElements(acorn.Parser)
    assert.strictEqual(first, privateClassElements(first))
  })
  it("checks that the same acorn copy is used", () => {
    assert.throws(() => privateClassElements(function () {}))
  })
})
