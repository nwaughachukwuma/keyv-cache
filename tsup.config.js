import { defineConfig } from "tsup";

export default defineConfig({
  sourcemap: "inline",
  clean: true,
  minify: true,
  entryPoints: ["index.ts"],
  format: ["esm", "cjs"],
  outDir: "lib",
  target: "node18",
});
