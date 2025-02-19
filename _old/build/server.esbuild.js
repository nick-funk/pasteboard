const esbuild = require("esbuild");
const nativeNodeModulesPlugin = require("./plugins/nativeNodeModules");

esbuild.build({
  entryPoints: ["src/server/main.ts"],
  bundle: true,
  outdir: "output/server/",
  minify: false,
  sourcemap: true,
  platform: "node",
  target: "esnext",
  tsconfig: "server.tsconfig.json",
  external: ["mongodb-client-encryption"],
  plugins: [nativeNodeModulesPlugin]
});