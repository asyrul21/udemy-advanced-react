const common = require("./webpack.common.config");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

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
      /**
       * Enabling and Optimizing Images
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
        },
        generator: {
          filename: "./images/[name].[contenthash:12][ext]",
        },
        /**
         * Optimizing Images: Using Loader
         */
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
  ],
});
