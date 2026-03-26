import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  minify: true,
  external: ["react"],
  banner: {
    js: "'use client';",
  },
});
// import { defineConfig } from "tsup";

// export default defineConfig({
//   entry: ["src/index.ts"],
//   format: ["cjs", "esm"],
//   dts: true,
//   clean: true,
//   external: ["react", "react-dom"]
// });