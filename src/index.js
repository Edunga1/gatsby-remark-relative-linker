import visit from "unist-util-visit"

export default function({ markdownAST }, { trailingSlash = true } = {}) {
  visit(markdownAST, "link", node => {
    if (isRelativeLink(node.url)) {
      const hashIndex = node.url.indexOf("#")
      const hash = hashIndex !== -1 ? node.url.slice(hashIndex) : ""
      const linkPath = hashIndex !== -1 ? node.url.slice(0, hashIndex) : node.url
      const withoutExt = linkPath.replace(/\.md$/, "")

      if (trailingSlash) {
        const segments = ["..", ...withoutExt.split("/")].filter(s => s !== ".")
        node.url = segments.join("/") + hash
      } else {
        node.url = withoutExt + hash
      }
    }
  })

  return markdownAST
}

function isRelativeLink(url) {
  return url && /^\.\.?\/.*\.md(#.*)?$/.test(url)
}
