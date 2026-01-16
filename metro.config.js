const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add 3D model extensions
config.resolver.assetExts.push(
  "glb",
  "gltf",
  "png",
  "jpg",
  "jpeg",
  "mtl",
  "obj",
  "bin"
);

config.resolver.sourceExts.push("js", "jsx", "ts", "tsx", "json");

module.exports = config;
