const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "output/**",
      "public/**",
      "src/controllers/**",
      "src/services/**",
      "src/data/**",
      "src/utils/**",
      "src/server.ts",
      "src/types.d.ts",
      "scripts/**",
      "eslint.config.js",
      "next-env.d.ts",
      "tailwind.config.ts",
      "postcss.config.mjs",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
