import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Default environment is node (engine and saifuro tests). Component tests opt in to a DOM
// with a first-line comment: `// @vitest-environment happy-dom`.
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
    setupFiles: ["src/test/setup.ts"],
  },
});
