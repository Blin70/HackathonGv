import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const projectRoot = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    // Mirrors the "@/*" path alias in tsconfig.json.
    alias: { "@": projectRoot },
  },
  test: {
    // Everything under test so far is pure logic, so no DOM is needed. A file
    // that does need one can opt in with `// @vitest-environment jsdom` once
    // jsdom is installed.
    environment: "node",
    include: ["{app,components,hooks,lib}/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
})
