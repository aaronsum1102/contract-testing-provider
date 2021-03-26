const slsw = require("serverless-webpack");

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
  },
  devtool: slsw.lib.webpack.isLocal ? "source-map" : undefined,
  optimization: {
    usedExports: true,
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: /node_modules/,
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json", ".mjs"],
  },
  externals: [/^aws-sdk.*/],
};
