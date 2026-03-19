import { describe, expect, it } from "@jest/globals"
import linker from "./index"

describe("Processing markdown AST", () => {
  it("should return the AST", async () => {
    const tree = createTree()
    const result = linker(tree)
    expect(result).toBe(tree.markdownAST)
  })
})

describe("Processing links (trailingSlash: always)", () => {
  it.each([
    ["./relative/path/example.md",         "../example/"],
    ["./relative/path/example.md#section", "../example/#section"],
    ["/absolute/path/example.md",          "../example/"],
    ["example.md",                         "../example/"],
    ["example.md#section",                 "../example/#section"],
    ["./example",                          "./example"],
    ["https://example.com",                "https://example.com"],
  ])("%s → %s", (input, expected) => {
    const tree = createTree({ trailingSlash: "always" })
    addLinkNode(tree, input)
    linker(tree)
    expect(tree.markdownAST.children.at(-1).url).toBe(expected)
  })
})

describe("Processing links (trailingSlash: never)", () => {
  it.each([
    ["./relative/path/example.md",         "example"],
    ["./relative/path/example.md#section", "example#section"],
    ["/absolute/path/example.md",          "example"],
    ["example.md",                         "example"],
    ["example.md#section",                 "example#section"],
    ["./example",                          "./example"],
    ["https://example.com",                "https://example.com"],
  ])("%s → %s", (input, expected) => {
    const tree = createTree({ trailingSlash: "never" })
    addLinkNode(tree, input)
    linker(tree)
    expect(tree.markdownAST.children.at(-1).url).toBe(expected)
  })
})

describe("Processing links (no getNodesByType)", () => {
  it.each([
    ["./relative/path/example.md",         "../example/"],
    ["./relative/path/example.md#section", "../example/#section"],
  ])("%s → %s (defaults to always)", (input, expected) => {
    const tree = createTree()
    delete tree.getNodesByType
    addLinkNode(tree, input)
    linker(tree)
    expect(tree.markdownAST.children.at(-1).url).toBe(expected)
  })
})

function createTree({ trailingSlash = "always" } = {}) {
  return {
    markdownAST: {
      type: "root",
      children: [
        {
          type: "heading",
          depth: 1,
          children: [{ type: "text", value: "Hello, world!" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "This is a paragraph." }],
        },
      ],
    },
    getNodesByType: (type) => {
      if (type === "Site") return [{ trailingSlash }]
      return []
    },
  }
}

function addLinkNode(tree, link) {
  tree.markdownAST.children.push({
    type: "link",
    url: link,
  })
}
