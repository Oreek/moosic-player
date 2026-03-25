import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
    {
        ignores: [
            "**/node_modules/**",
            "**/.expo/**",
            "**/.next/**",
            "**/__generated__/**",
            "**/build/**",
            "/react-native-lab/react-native/**",
            "/docs/react-native-website/**",
            "**/android/**",
            "**/assets/**",
            "**/bin/**",
            "**/fastlane/**",
            "**/ios/**",
            "**/kotlin/providers/**",
            "**/vendored/**",
            "/docs/public/static/**",
        ],
    },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                process: "readonly",
                module: "readonly",
                require: "readonly",
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "import/order": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "react/react-in-jsx-scope": "off",
            "react/display-name": "off",
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
];