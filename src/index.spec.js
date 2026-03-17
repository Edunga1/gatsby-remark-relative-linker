import { describe, expect, it } from "@jest/globals"
import linker from "./index"

describe("Processing markdown AST", () => {
  it("should return the AST", async () => {
    const tree = createTree()
    const result = linker(tree)
    expect(result).toBe(tree.markdownAST)
  })
})

describe("Processing markdown links", () => {
  it("should replace the relative link with a relative path", async () => {
    const tree = createTree()
    addLinkNode(tree, "./relative/path/example.md")
    linker(tree)

    expect(tree).toBeDefined()
    expect(tree.markdownAST.children.at(-1).url).toBe("../example/")
  })

  it("should keep the hash part of the link", async () => {
    const tree = createTree()
    addLinkNode(tree, "./relative/path/example.md#section")
    linker(tree)

    expect(tree).toBeDefined()
    expect(tree.markdownAST.children.at(-1).url).toBe("../example/#section")
  })
})

describe("Respecting trailingSlash option", () => {
  it("should add trailing slash when trailingSlash is true", async () => {
    const tree = createTree()
    addLinkNode(tree, "./relative/path/example.md")
    linker(tree, { trailingSlash: true })

    expect(tree.markdownAST.children.at(-1).url).toBe("../example/")
  })

  it("should not add trailing slash when trailingSlash is false", async () => {
    const tree = createTree()
    addLinkNode(tree, "./relative/path/example.md")
    linker(tree, { trailingSlash: false })

    expect(tree.markdownAST.children.at(-1).url).toBe("../example")
  })

  it("should not add trailing slash with hash when trailingSlash is false", async () => {
    const tree = createTree()
    addLinkNode(tree, "./relative/path/example.md#section")
    linker(tree, { trailingSlash: false })

    expect(tree.markdownAST.children.at(-1).url).toBe("../example#section")
  })

  it("should default to true when trailingSlash is not specified", async () => {
    const tree = createTree()
    addLinkNode(tree, "./relative/path/example.md")
    linker(tree)

    expect(tree.markdownAST.children.at(-1).url).toBe("../example/")
  })
})

describe("Processing non-markdown links", () => {
  it("should not replace the link without .md extension", async () => {
    const tree = createTree()
    addLinkNode(tree, "./example")
    linker(tree)

    expect(tree).toBeDefined()
    expect(tree.markdownAST.children.at(-1).url).toBe("./example")
  })

  it("should not replace the http link", async () => {
    const tree = createTree()
    addLinkNode(tree, "https://example.com")
    linker(tree)

    expect(tree).toBeDefined()
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
