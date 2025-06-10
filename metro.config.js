const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add crypto-js support for React Native
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: "crypto-js",
};

// Ensure proper file extensions are resolved
config.resolver.sourceExts = [...config.resolver.sourceExts, "jsx", "js", "ts", "tsx"];

module.exports = withNativeWind(config, { input: "./global.css" });
