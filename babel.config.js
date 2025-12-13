const path = require("path");

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: [path.resolve("./")],
          alias: {
            styles: path.resolve("./styles"),
            components: path.resolve("./components"),
            utils: path.resolve("./utils"),
            hooks: path.resolve("./hooks"),
            reducers: path.resolve("./reducers"),
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
    ],
  };
};

