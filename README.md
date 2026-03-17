# gatsby-remark-relative-linker

A plugin for `gatsby-transformer-remark` that transforms relative links in markdown files to their corresponding relative paths.

this is inspired by https://stackoverflow.com/q/48553146/6587078

Add this plugin to your `gatsby-config` file:

```typescript
{
  resolve: "gatsby-transformer-remark",
  options: {
    plugins: [
      {
        resolve: "gatsby-remark-relative-linker",
        options: {
          trailingSlash: true, // default: true
        },
      },
    ]
  }
}
```