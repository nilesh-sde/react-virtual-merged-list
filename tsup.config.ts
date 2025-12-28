import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // Output both formats
  dts: true, // Generate TypeScript declaration files
  clean: true,
  sourcemap: true,
  minify: false, // Minify for production
  external: ["react", "react-dom", "react-window"], // Don't bundle these!
});
