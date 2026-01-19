import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  // 1. Konfigurasi Global
  { ignores: ["dist"] },

  // 2. Konfigurasi Utama
  {
    files: ["**/*.{js,jsx}"],

    // Setup Bahasa & Parser
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },

    // Setup Plugin
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    // Aturan (Rules)
    rules: {
      ...js.configs.recommended.rules,

      ...reactHooks.configs.recommended.rules,

      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      "no-unused-vars": "off",
    },
  },
];
