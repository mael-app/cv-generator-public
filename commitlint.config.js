module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [0], // disabled — editors often wrap commit bodies automatically
  },
};
