import visit from "unist-util-visit"

export default function({ markdownAST }, { trailingSlash = true } = {}) {
  visit(markdownAST, "link", node => {
    if (isRelativeLink(node.url)) {
      node.url = node.url.replace(/.*\/(.+)\.md(#.*)?.*$/, (match, _, hash) => {
        const hashStr = hash || ""
        const basePath = hashStr ? match.slice(0, -hashStr.length - 3) : match.slice(0, -3)
        const path = trailingSlash && basePath.startsWith(".")
          ? "../" + basePath.replace(/^\.\//, "")
          : basePath
        return path + hashStr
      })
    }
  })

  return markdownAST
}

function isRelativeLink(url) {
  return url && url.match(/.*\/(.+)\.md(#.*)?/)
}
