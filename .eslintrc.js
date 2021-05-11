module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
    },
    env: {
        es6: true,
        node: true,
    },
    plugins: ["@typescript-eslint", "prettier"],
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:node/recommended",
        "plugin:security/recommended",
        "eslint:recommended",
        "plugin:prettier/recommended",
    ],
    rules: {
        "prettier/prettier": "error",
        "node/no-unsupported-features/es-syntax": "off",
        "no-process-exit": "off",
        "node/no-missing-import": ["error", {
            "tryExtensions": [".js", ".json", ".d.ts", ".ts"]
        }],
        "@typescript-eslint/require-await": "off"
    },
    settings: {
        node: {
            allowModules: ["dotenv"],
            resolvePaths: [__dirname],
            tryExtensions: [".ts", ".json"],
        },
    },
};
