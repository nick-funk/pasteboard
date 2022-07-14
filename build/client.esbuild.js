const esbuild = require("esbuild");

esbuild.buildSync({
  entryPoints: ["src/client/index.tsx"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: "output/client/index.js",
  tsconfig: "client.tsconfig.json",
});