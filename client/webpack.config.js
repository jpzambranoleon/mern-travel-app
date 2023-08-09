const path = require("path");

module.exports = {
  entry: "./src/main.jsx", // Replace './src/index.js' with your entry file path
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", // Replace 'bundle.js' with your desired output file name
  },
  module: {
    rules: [
      // ... other rules
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
