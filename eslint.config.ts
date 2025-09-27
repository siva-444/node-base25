import js from "@eslint/js";
import pluginPrettier from "eslint-config-prettier/flat";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
import globals from "globals";
import { configs, parser } from "typescript-eslint";

const ignore = { ignores: ["dist", "node_modules"] };
// Base JavaScript config (recommended rules)
const baseJs = [
  js.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    name: "base-js/custom-overrides",
    languageOptions: {
      globals: globals.node, // Node.js globals (e.g.,x process, Buffer)
      ecmaVersion: "latest",
      sourceType: "module",
      project: "./tsconfig.json",
      parser: parser,
    },
    settings: {
      "import-x/resolver-next": createTypeScriptImportResolver({
        alwaysTryTypes: true,
        project: "./tsconfig.json", // Enables type-aware linting
      }),
    },
  },
];

// TypeScript-specific config (consolidated)
const typescript = {
  name: "typescript-eslint/custom-overrides",
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json", // Enables type-aware linting
      projectService: true,
      tsconfigRootDir: import.meta.dirname, // Use __dirname for CJS compatibility; switch to import.meta.dirname if fully ESM
    },
  },
  rules: {
    indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn", // Warn on 'any' to encourage refactoring
    "@typescript-eslint/consistent-type-imports": "error",
    // Disable conflicting rules
    "@typescript-eslint/no-var-requires": "off", // Since we're using ESM
  },
};

// Import rules (with TypeScript resolver)
const imports = {
  files: ["**/*.ts"],
  rules: {
    "import-x/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
        js: "always",
        jsx: "always",
      },
    ],

    "import-x/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
          "type",
          "object",
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
  },
};

// Main export: Combine all configs (Prettier last to override formatting)
/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ignore,
  // Base
  ...baseJs,

  // TypeScript
  ...configs.recommendedTypeChecked,
  ...configs.stylisticTypeCheckedOnly,
  typescript,

  // Imports
  imports,

  // Prettier (last, to handle formatting without conflicts)
  pluginPrettier,
];

export default eslintConfig;
