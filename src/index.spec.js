import { describe, expect, it } from "@jest/globals"
import linker from "./index"

describe("Processing markdown AST", () => {
  it("should return the AST", () => {
    const tree = createTree()
    const result = linker(tree)
    expect(result).toBe(tree.markdownAST)
  })
})

describe("Processing markdown links", () => {
  it.each([
    [true, "./bar.md", "../bar"],
    [true, "../baz.md", "../../baz"],
    [true, "./bar/baz.md", "../bar/baz"],
    [true, "./deeply/nested/path.md", "../deeply/nested/path"],
    [true, "./bar.md#section", "../bar#section"],
    [true, "../baz.md#heading", "../../baz#heading"],
    [true, "/foo/bar/baz.md", "/foo/bar/baz"],
    [true, "/foo/bar/baz.md#section", "/foo/bar/baz#section"],
    [false, "./bar.md", "./bar"],
    [false, "../baz.md", "../baz"],
    [false, "./bar/baz.md", "./bar/baz"],
    [false, "./bar.md#section", "./bar#section"],
    [false, "/foo/bar/baz.md", "/foo/bar/baz"],
    [false, "/foo/bar/baz.md#section", "/foo/bar/baz#section"],
  ])("trailingSlash=%s: %s → %s", (trailingSlash, link, expected) => {
    const tree = createTree()
    addLinkNode(tree, link)
    linker(tree, { trailingSlash })

    expect(tree.markdownAST.children.at(-1).url).toBe(expected)
  })
})

describe("Processing non-markdown links", () => {
  it("should not replace the link without .md extension", () => {
    const tree = createTree()
    addLinkNode(tree, "./example")
    linker(tree)

    expect(tree.markdownAST.children.at(-1).url).toBe("./example")
  })

  it("should not replace the http link", () => {
    const tree = createTree()
    addLinkNode(tree, "https://example.com")
    linker(tree)

    expect(tree.markdownAST.children.at(-1).url).toBe("https://example.com")
  })
})

function createTree() {
  return {
    markdownAST: {
      type: "root",
      children: [
        {
          type: "heading",
          depth: 1,
          children: [
            {
              type: "text",
              value: "Hello, world!",
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: "This is a paragraph.",
            },
          ],
        },
      ],
    },
  }
}

function addLinkNode(tree, link) {
  tree.markdownAST.children.push({
    type: "link",
    url: link,
  })
}
