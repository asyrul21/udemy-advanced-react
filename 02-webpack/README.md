# Webpack Notes

## Basic Setup

1. NPM Init Project, to generate `package.json`

```bash
npm init
```

2. Install Webpack

```bash
npm install --save-dev webpack webpack-cli webpack-merge
```

3. Run Webpack - generates a `dist/main.js`

```bash
npx webpack --mode={mode}
# npx webpack --mode=development
# webpack --config webpack/webpack.dev.config.js
```

Or use a build script in `package.json`:

```json
"scripts": {
    "build:dev": "webpack --config webpack/webpack.dev.config.js",
    "build:prod": "webpack --config webpack/webpack.prod.config.js"
},
```

then

```bash
npm run build:dev
```

4. Reference your `dist/main.js` in your html:

```html
<script src="./dist/main.js"></script>
```

## Overview

### Modes

1. Development - larger file, but faster build time.

2. Production - files are optimized, smaller, but build time longer.

3. None

### Webpack Config File

Default Configuration:

```javascript
const path = require("path");

const config = {
  entry: "./src/",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    /* clean to wipe old output and replace with new one*/
    clean: true,
    //
    // OR
    //
    // clean: {
    //   dry: true,
    //   keep: /\.css$/
    // }
    //
    // OR
    //
    // use clean webpack plugin
  },
  mode: "production",
  /**
   * devServer to use Webpack's dev server
   */
  devServer: {
    port: 9000,
    static: {
      /* path to index.html */
      directory: path.resolve(__dirname, "../dist"),
    },
    devMiddleware: {
      index: "index.html",
      /**
       *  writeToDisk: tell webpack to write to dist/ folder as server is running
       */
      writeToDisk: true,
    },
    client: {
      /**
       * show errors on browser as overlay
       */
      overlay: true,
    },
    liveReload: false,
  },
  /**
   *
   * Modules
   *
   */
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  /**
   *
   *  PLugins
   *
   */
  plugins: [
    new MiniCssExtractPlugin({
      // for multi entry:
      // filename: '[name].[contenthash].css'
      // for single entry:
      filename: "[name].css",
    }),
  ],
};

module.exports = config;
```

### Webpack Server and Hot Reloading

1. Install:

```bash
npm install --save-dev webpack-dev-server
```

2. Add to your Webpack config:

```js
 devServer: {
    port: 9000,
    static: {
      directory: path.resolve(__dirname, ".."),
    },
    devMiddleware: {
      index: "index.html",
      /**
       *  writeToDisk: tell webpack to write to dist/ folder as server is running
       */
      writeToDisk: true,
    },
    client: {
      /**
       * show errors on browser as overlay
       */
      overlay: true,
    },
    liveReload: false,
  },
```

3. Adjust your dev script:

```json
"scripts": {
    "build:dev": "webpack serve --config webpack/webpack.dev.config.js --hot",
}
```

### Dynamically Generating `index.html`

1. Install `html-webpack-plugin` Plugin

```bash
npm install --save-dev html-webpack-plugin html-loader
```

2. Create custom html template:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>To Do List Application</title>
  </head>
  <body>
    <img
      class="header-image"
      src="./images/header-image.jpg"
      alt="To Do List"
    />
    <h1>To Do List</h1>
    <div class="todolist-wrapper">
      <input class="new-todo" placeholder="Enter text here" autofocus />
      <ul class="todo-list"></ul>
    </div>
  </body>
</html>
```

3. Configure in `webpack.common.config`, providing your custom template:

```js
module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
    ],
},
plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/template.html",
    }),
],
```

### Enabling Webpack `clean` with Dev Server

1. Install Plugin:

```bash
npm install --save-dev clean-webpack-plugin
```

2. Add to config

```js
plugins: [
    new CleanWebpackPlugin(),
    /**
     *
     * to clean mutiple folders:
     *
     */
    // new CleanWebpackPlugin({
    //   cleanOnceBeforeBuildPatterns: [
    //     "**/*",
    //     path.join(process.cwd(), "dist-2/**/*"),
    //   ],
    // }),
],
```

## Processing and Optimizing Styles

### Processing CSS Files with Webpack

1. Install Loader

```bash
npm install  --save-dev css-loader style-loader
```

or use `MiniCssExtractPlugin` to minify css:

```bash
npm install --save-dev mini-css-extract-plugin

```

2. Configure the loader in configuration:

```js
module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // OR if you want to use MiniCssExtract plugin
{
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
```

3. (if you use MiniCssExtractPlugin) Add MiniCssExtract Plugin in `webpack.prod.config.js`

```js
plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
  ],
```

4. Remove reference to style files in your `index.html`

```html
<html>
  <head>
    <meta charset="utf-8" />
    <title>To Do List Application</title>
    <!-- <link rel="stylesheet" href="./src/styles/index.css" /> -->
  </head>
</html>
```

5. Import CSS in your `javascript` file:

```js
import "../styles/index.css";
```

### Enabling CSS Modules

Config:

```js
module: {
    rules: [
      {
        test: /\.css$/,
        /**
         * Do not minify CSS modules
         */
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      /**
       * Process CSS modules
       */
      {
        test: /\.css$/,
        /**
         * Do not minify CSS modules
         */
        include: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
               modules: {
                localIdentName: "[hash:base64]",
                // localIdentName: "[local]--[md4:hash:7]", // dev
              },
            },
          },
        ],
      },
    ],
  },
```

### Minifying CSS

1. Install `Css Minimizer Webpack Plugin`

```bash
npm --save-dev install css-minimizer-webpack-plugin
```

2. Add to prod config:

```js
optimization: {
    minimize: true,
    minimizer: [
      `...`, // to extend default minimizers
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        },
      }),
    ],
},
```

### Enabling SASS / LESS

1. Install loader:

```bash
npm install --save-dev less less-loader

# or

npm install --save-dev sass sass-loader
```

2. Add to module.rule in config:

```js
 /**
 * Enabling LESS
 */
{
  test: /\.less$/,
  use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
},
 /**
 * Enabling SASS
 */
{
  test: /\.scss$/,
  use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
},
```

### Enabling PostCss to Handle Auto Browser Prefixes

1. Install loader:

```bash
npm install --save-dev autoprefixer postcss-loader
```

2. Create your `.browserslistsrc`

3. Create `postcss.config.js`

4. Add to module.rule in config:

```js
{
  test: /\.scss$/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    "postcss-loader",
    "sass-loader",
  ],
},
```

### Removed Unused CSS

1. Install loader:

```bash
npm install --save-dev purgecss-webpack-plugin
```

2. Add to module.rule in config:

```js
{
  test: /\.scss$/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    "postcss-loader",
    "sass-loader",
  ],
},
```

## Processing Images and SVG Icons

Images referenced in `template.html` `<img />` tags are handled by `HTML Loader`.

2 Ways Webpack will handle Image references:

1. Creating a Base64 string and inject directly to img `src` prop - suitable for small files / SVG Icons

or

2. Create a new optimized image file, and use the url to to that image in the img `src` prop - suitable for bigger image files

### Basic Configuration

To use image or icon in Javascript files:

1. Add rule to (dev) config:

```js
/**
       * Enabling Images
       */
      {
        test: /\.(png|jpg|svg)/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            /**
             * If file is less than 10Kb, webpack will inline/inject the file directly to js code
             * Otherwise, webpack will create an optimized image file in directory,
             * and reference that url
             */
            maxSize: 10 * 1024,
          },
          generator: {
            filename: "./images/[name][ext]",
          },
        },
      },
```

2. Import image in your js file:

```js
import CheckmarkImage from '../../images/checkmark.svg
```

4. Reference the image in your js code:

```js
return `
  <img class="check" src="${CheckmarkImage}" width="22" height="22"></img>
`;
```

### Optimizing

#### Method 1: Using a Loader

1. Install image-webpack-loader

```bash
npm install --save-dev image-webpack-loader
```

2. Configure (prod) config

```js
use: [
      {
        loader: "image-webpack-loader",
        options: {
          mozjpeg: {
            quality: 40,
          },
          pngquant: {
            /**
             * min, max
             */
            quality: [0.65, 0.9],
            speed: 4,
          },
        },
      },
  ],
```

#### Method 2: Using Optimize Plugin

1. Install

```bash
npm install --save-dev image-minimizer-webpack-plugin imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo
```

2. Add to (prod) optimization.minimizer config:

```js
minimizer: [
  `...`,
  /**
   * Image minimizer optimization
   *
   * https://github.com/imagemin/imagemin
   *
   * https://github.com/webpack-contrib/image-minimizer-webpack-plugin/tree/master
   */
  new ImageMinimizerPlugin({
    minimizer: {
      implementation: ImageMinimizerPlugin.imageminMinify, // imagemin
      options: {
        plugins: [
          // https://github.com/imagemin/imagemin-mozjpeg
          ["imagemin-mozjpeg", { quality: 40 }],
          // https://github.com/imagemin/imagemin-pngquant
          ["imagemin-pngquant", { quality: [0.65, 0.9], speed: 4 }],
          // https://github.com/imagemin/imagemin-gifsicle
          ["imagemin-gifsicle", { interlaced: true }],
          // https://github.com/imagemin/imagemin-svgo
          [
            "imagemin-svgo",
            {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false,
                      addAttributesToSVGElement: {
                        params: {
                          attributes: [
                            { xmlns: "http://www.w3.org/2000/svg" },
                          ],
                        },
                      },
                    },
                  },
                },
              ],
            },
          ],
        ],
      },
    },
  }),
],
```

### Optimizing Multiple Images Stored On File System

Use `copy-webpack-plugin`, ALONGSIDE with ImageMinimizer in previous section.

Watch [Lecture](https://www.udemy.com/course/webpack-optimizing-for-production/learn/lecture/35674534)

1. Install

```bash
npm install --save-dev copy-webpack-plugin
```

2. Configure in (common) config

```js
plugins: [
  // ...
  new CopyWebpackPlugin({
    patterns: [
      {
        from: "images/motivational-pictures/*.*",
      },
    ],
  }),
],
```

### Converting JPG and PNG to WebP

Update your (prod) config's Image Minimizer Plugin, same level as `minimizer`

```js
new ImageMinimizerPlugin({
    minimizer: {
      implementation: ImageMinimizerPlugin.imageminMinify, // imagemin
      options: {
        // ...
      },
    },
    generator: {
      type: "asset",
      preset: "webp-custom-name",
      implementation: ImageMinimizerPlugin.imageminGenerate,
      options: {
        plugins: ["imagemin-webp"],
      },
    },
  }),
```

## Babel

Translate recent Javascript syntax to older syntaxes, which can be compatible with old Browsers.

Preset: Collection of multiple plugins.

## Basic Configuration

1. Install

```
npm install --save-dev @babel/core @babel/preset-env babel-loader
```

2. `.browserlist` configs. Babel `preset-env` uses the `.browserlist` file to decide what to translate:

```.browserlist
>0.25%
```

3. Babel Configuration

```json
{
  "presets": [["@babel/preset-env"]]
}
```

4. Configure Babel into Webpack in (common) config:

```js
module: {
  rules: [
    // ... ,
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      },
    },
  ],
},
```

## Polyfills

Adding `polyfills` for missing features. For eg, some features are not avaible in certain browsers, like `Promise.any` etc.

Polyfills are used to add these features to the browsers as a `polyfill`.

Provide modern functionality to older browsers that dont natively support.

### Configure

IMPORTANT: `npm run build:prod` DOES NOT WORK.

1. Install `corejs`

```bash
npm install --save-dev corejs
```

2. Configure `.babelrc`

We need to tell Babel NOT to add Polyfills in Development mode, only for Production

```json
{
  "env": {
    "production": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": "usage",
            "corejs": {
              "version": 3,
              "proposals": true
            },
            "debug": true
          }
        ]
      ]
    },
    "dev": {
      "presets": [["@babel/preset-env"]]
    }
  }
}
```

3. Add environment variable in `package.json`

```json
"scripts": {
    "build:dev": "BABEL_ENV=dev webpack serve --config webpack/webpack.dev.config.js --hot",
    "build:prod": "BABEL_ENV=production webpack --config webpack/webpack.prod.config.js"
  },
```

for Windows:

```json
set NODE_ENV=production&& <command>
```

or Install `cross-env`

```bash
npm install save-dev cross-env
```

`package.json`:

```json
cross-env NODE_ENV=production ...
```

## Configuring Typescript

DOES NOT WORK

## Source Maps

Maps generated Javascript bundle to the original JS File.

Helps with debugging.

[All Dev Tools](https://webpack.js.org/configuration/devtool/)

### Basic Configuration

Add to config:

```js
devtool: "source-map",
```

Or To enable faster build time, add in (dev) config:

```js
devtool: "eval-source-map",
```

## Tree Shaking

Eliminate unused code.

IMPORTANT: Tree Shaking Only works with packages exported as `ECMAScript Modules` ie. `esm`

[All Optimizations](https://webpack.js.org/configuration/optimization/)

### Basic Configuration

Add to config:

```js
optimization: {
  usedExports: true;
}
```

## Code Splitting

To separate bundle to multiple chunks.

### Basic Configuration

### Strategy 1: Extract Huge Libraries into Seperate Bundles

Use `split-chunks-plugin` built-in plugin.

Add to (prod) config's `optimization`:

```js
optimization: {
  splitChunks: {
    cacheGroups: {
      jquery: {
        test: /[\\/]node_modules[\\/]jquery[\\/]/,
        chunks: "initial" // initial | all | async,
        name: 'jquery
      },
      bootstrap: {
        test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
        chunks: 'initial,
        name: 'bootstrap'
      }
    }
  }
}
```

### Strategy 2: Specify Criteria / Rules

```js
optimization: {
  splitChunks: {
    chunks: 'all',
    maxSize: 140000, // if more than size, it will be split
    minSize: 50000,
    name(module, chunks, chacheGroupKey){
      const filepathsarr = module.identifier().split('/')
      return filepathsarr[filepathsarr.length -1]
    }
  }
}
```

### Strategy 3: Put Node_Modules in Separate Bundle

```js
optimization: {
  splitChunks: {
    chunks: 'all',
    maxSize: Infinity,
    minSize: 0,
    cacheGroups: {
      node_modules: {
        test: /[\\/]node_modules[\\/]jquery[\\/]/,
        name: 'node_modules
      }
    }
  }
}
```

### Strategy 4: Create Bundle for Each Dependency

```js
optimization: {
  splitChunks: {
    chunks: 'all',
    maxSize: Infinity,
    minSize: 0,
    cacheGroups: {
      node_modules: {
        test: /[\\/]node_modules[\\/]jquery[\\/]/,
        name(module){
          const packagename = module.context.match(/[\\/]node_modules[\\/](.*?)[\\/]|$/)[0]
          return packagename;
        }
      }
    }
  }
}
```

## Lazy Loading

Lazy Loading technique:

```javascript
export function removeTodoEventHandler(event){
  import('bootstrap').then(function({Modal}) => {
    const id = getTodoId(event.target)
    $('#modal-delete-button').data('todo-id', id)
    const deleteTodoModal = Modal.getOrCreateInstance(
      document.getElementById('modal-delete-todo)
    )
    deleteTodoModal.show()ß
  })
}
```

Lazy loading multiple modules in parallel:

```javascript
export function removeTodoEventHandler(event){
  Promise.all([
    import('bootstrap'), // webpackChunkName: 'bootstrap'
    import('jquery') // webpackChunkName: 'jquery
  ]).then(function([{Modal}, { default: $ }]) => {
    const id = getTodoId(event.target)
    $('#modal-delete-button').data('todo-id', id)
    const deleteTodoModal = Modal.getOrCreateInstance(
      document.getElementById('modal-delete-todo)
    )
    deleteTodoModal.show()ß
  })
}
```

webpack config:

```js
optimization: {
  splitChunks: {
    chunks: 'all',
    maxSize: Infinity,
    minSize: 0,
    cacheGroups: {
      node_modules: {
        test: /[\\/]node_modules[\\/]jquery[\\/]/,
        name: 'node_modules',
        chunks: 'initial
      },
      /**
       * Lazy Loading
      */
     async: {
      test: /[\\/]node_modules[\\/]/,
      chunks: 'async',
      name(module, chunks){
        return chunks.map(chunk => chunk.name).join('-')
      }
     }
    }
  }
}
```
