const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const config = {
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    /* clean to wipe old output and replace with new one*/
    // or - use clean webpack plugin
    clean: true,
  },
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
    // new CleanWebpackPlugin(),
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
};

module.exports = config;
