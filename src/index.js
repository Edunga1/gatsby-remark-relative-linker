import visit from "unist-util-visit"

export default function({ markdownAST, getNodesByType }) {
  const trailingSlash = readTrailingSlash(getNodesByType)

  visit(markdownAST, "link", node => {
    if (isRelativeLink(node.url)) {
      node.url = node.url.replace(/(?:.*\/)?(.+)\.md(#.*)?$/, (_, base, hash) =>
        trailingSlash === "never"
          ? `${base}${hash || ""}`
          : `../${base}/${hash || ""}`
      )
    }
  })

  return markdownAST
}

function readTrailingSlash(getNodesByType) {
  if (!getNodesByType) return "always"
  const sites = getNodesByType("Site")
  if (sites.length > 0 && sites[0].trailingSlash) {
    return sites[0].trailingSlash
  }
  return "always"
}

function isRelativeLink(url) {
  return url && !url.includes("://") && /\.md(#.*)?$/.test(url)
}
