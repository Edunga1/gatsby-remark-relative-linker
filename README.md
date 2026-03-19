# gatsby-remark-relative-linker

A plugin for `gatsby-transformer-remark` that transforms relative links in markdown files to their corresponding relative paths.

this is inspired by https://stackoverflow.com/q/48553146/6587078

Add this plugin to your `gatsby-config` file:

```typescript
{
  resolve: "gatsby-transformer-remark",
  options: {
    plugins: [
      "gatsby-remark-relative-linker",
    ]
  }
}
```

This plugin respects the [`trailingSlash`](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/#trailingslash) option in `gatsby-config`:

| trailingSlash | Input | Output |
|---|---|---|
| `"always"` (default) | `./path/example.md` | `../example/` |
| `"never"` | `./path/example.md` | `example` |

Note that the converted links may not look as expected based on [slugify](https://www.gatsbyjs.com/docs/creating-slugs-for-pages/) policies.
