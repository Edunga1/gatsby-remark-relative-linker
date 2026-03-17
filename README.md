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

## Options

### `trailingSlash` (default: `true`)

Indicates whether the current page URL has a trailing slash, which determines how relative link prefixes are resolved.

- `true`: Adds an extra `../` level to the resolved path (for pages served with trailing slash).
- `false`: Keeps the original relative path structure as-is.

| trailingSlash | Input | Output |
|---|---|---|
| `true` | `./bar.md` | `../bar` |
| `true` | `../baz.md` | `../../baz` |
| `true` | `./bar/baz.md` | `../bar/baz` |
| `true` | `./bar.md#section` | `../bar#section` |
| `false` | `./bar.md` | `./bar` |
| `false` | `../baz.md` | `../baz` |
| `false` | `./bar/baz.md` | `./bar/baz` |
| `false` | `./bar.md#section` | `./bar#section` |
