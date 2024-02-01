const common = require("./webpack.common.config");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "js/[name].[contenthash:12].js",
  },
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
        include: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[hash:base64]",
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
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      /**
       * Enabling SASS
       */
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // for multi entry:
      // filename: '[name].[contenthash].css'
      // for single entry:
      filename: "css/[name].css",
    }),
    // new PurgeCSSPlugin({
    //   // ...
    // }),
  ],
});
