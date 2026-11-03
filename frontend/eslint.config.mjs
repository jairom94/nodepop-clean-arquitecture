import eslintConfigPrettier from "eslint-config-prettier";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import queryPlugin from "@tanstack/eslint-plugin-query";

export default tseslint.config(
  {
    ignores: ["dist", "node_modules"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  ...queryPlugin.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    // Scripts de mantenimiento que se ejecutan con Node
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);
