import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { ESLint } from "eslint";
import { TSESLint } from "@typescript-eslint/utils";

const config: ESLint.ConfigData = {
  ignores: ["dist"], // Ignore the dist folder

  extends: [
    js.configs.recommended, // JavaScript recommended rules
    ...require("@typescript-eslint/eslint-plugin").configs.recommended, // TypeScript recommended rules
  ],

  files: ["**/*.{ts,tsx}"], // Only include TypeScript and TSX files

  languageOptions: {
    ecmaVersion: 2020, // Use ECMAScript 2020 syntax
    globals: globals.browser, // Use browser globals
  },

  plugins: {
    "react-hooks": reactHooks, // React hooks linting rules
    "react-refresh": reactRefresh, // React fast refresh plugin for ESLint
  },

  rules: {
    ...reactHooks.configs.recommended.rules, // Include recommended React Hooks rules
    "react-refresh/only-export-components": [
      "warn", 
      { allowConstantExport: true }, // Allow constant exports in fast refresh
    ],
    "@typescript-eslint/no-unused-vars": "off", // Disable unused vars warning for TypeScript
  },
};

export default config;
