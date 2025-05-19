// eslint.config.js
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default [
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**", "*.config.js", "*.config.ts"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // Initially, let's use fewer rules to ensure basic setup works.
      // We can add more specific rules from the old config later.
    }
  },
  ...tseslint.configs.recommended, // Apply recommended TypeScript rules
  {
    files: ["tests/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  {
    files: ["src/parser/xmlParser.ts"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    // Prettierとの連携設定
    // Prettier関連の設定は一番最後に配置することが推奨されます
    // (他のルール設定を上書きできるようにするため)
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"], // Prettierを適用するファイル拡張子
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...configPrettier.rules, // Prettierと競合するESLintルールを無効化
      "prettier/prettier": "error", // Prettierのルール違反をESLintエラーとして報告
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrors": "all",
        }
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
]; 