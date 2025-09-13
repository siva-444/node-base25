import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import nPlugin from "eslint-plugin-n";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // Base JS rules
  js.configs.recommended,

  // TypeScript recommended configs
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // Node.js plugin rules
  nPlugin.configs["recommended-module"],

  // Import + Prettier plugins
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { import: importPlugin, prettier: prettierPlugin },
    rules: {
      /* Style */
      indent: ["error", "tab"],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"],

      /* Imports */
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "type",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    settings: {
      "import/resolver": {
        // The key 'typescript' tells the import plugin to use the
        // eslint-import-resolver-typescript package.
        typescript: {
          // Point the resolver to your main tsconfig file.
          project: "./tsconfig.json",
        },
      },
    },
  },

  // Project-specific setup
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
      },
    },
    rules: {
      indent: ["error", "tab"],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"],

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",

      /* Prettier */
      "prettier/prettier": "error",
    },
  },
];
