const next = require("eslint-config-next/core-web-vitals");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "output/**",
      "public/**",
      "coverage/**",
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
  ...next,
  {
    rules: {
      // Hydrating state from localStorage inside an effect is intentional here.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];
