const common = require("./webpack.common.config");
const { merge } = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
  output: {
    filename: "main.js",
  },
  mode: "development",
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
  module: {
    rules: [
      {
        test: /\.css$/,
        /**
         * Do not minify CSS modules
         */
        exclude: /\.module\.css$/,
        use: ["style-loader", "css-loader"],
      },
      /**
       * Process CSS modules
       */
      {
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]--[md4:hash:7]",
              },
            },
          },
        ],
      },
      /**
       * Enabling LESS
       */
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      /**
       * Enabling SASS
       */
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
});
