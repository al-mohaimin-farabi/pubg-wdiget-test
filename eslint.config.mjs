import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: ["react", "react-hooks", "react-compiler"],
    extends: [
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:react-compiler/recommended",
    ],
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
