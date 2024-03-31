import visit from "unist-util-visit"

export default function({ markdownAST }) {
  visit(markdownAST, "link", node => {
    if (isRelativeLink(node.url)) {
      node.url = node.url.replace(/.*\/(.+)\.md(#.*)?.*$/, (_, base, hash) => {
        return `../${base}${hash || ""}`
      })
    }
  })

  return markdownAST
}

function isRelativeLink(url) {
  return url && url.match(/.*\/(.+)\.md(#.*)?/)
}
