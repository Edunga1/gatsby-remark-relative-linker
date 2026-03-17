import visit from "unist-util-visit"

export default function({ markdownAST }, { trailingSlash = true } = {}) {
  visit(markdownAST, "link", node => {
    if (isRelativeLink(node.url)) {
      node.url = node.url.replace(/.*\/(.+)\.md(#.*)?.*$/, (_, base, hash) => {
        const slash = trailingSlash && !base.endsWith("/") ? "/" : ""
        return `../${base}${slash}${hash || ""}`
      })
    }
  })

  return markdownAST
}

function isRelativeLink(url) {
  return url && url.match(/.*\/(.+)\.md(#.*)?/)
}
