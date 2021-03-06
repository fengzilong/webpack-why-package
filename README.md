# webpack-why-package

[![npm](https://img.shields.io/npm/v/webpack-why-package.svg)](https://www.npmjs.org/package/webpack-why-package)
[![Node.js CI status](https://github.com/fengzilong/webpack-why-package/workflows/Node.js%20CI/badge.svg)](https://github.com/fengzilong/webpack-why-package/actions)
[![npm](https://img.shields.io/npm/dm/webpack-why-package.svg)](https://www.npmjs.org/package/webpack-why-package)
[![npm](https://img.shields.io/npm/l/webpack-why-package.svg)](https://www.npmjs.org/package/webpack-why-package)

Answer to "Why that package is in the bundle"

<img src="media/screenshot.jpg" alt="screenshot" width="450" />

Show the whole `issuer chain` and tell you why that package is in your bundle

## Installation

```bash
npm i webpack-why-package
```

## Webpack Plugin

```js
const WebpackWhyPackagePlugin = require( 'webpack-why-package' ).Plugin

// in your webpack config
{
  plugins: [
    new WebpackWhyPackagePlugin()
  ]
}
```

## API

```js
const { analyze, format } = require( 'webpack-why-package' )

console.log( format( analyze( webpackStats ) ) )
```

## License

MIT