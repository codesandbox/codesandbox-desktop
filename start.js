const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/view/renderer.ts",
  target: "electron-renderer",
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./src/view/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
