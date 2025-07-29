// This configuration file is used by lint-staged to run linters and formatters on staged files before committing.
// It specifies commands to run for different file types, ensuring code quality and consistency.
// The commands include linting with ESLint and Stylelint, as well as formatting checks.
// The configuration is structured to run specific commands based on the file extensions of the staged files.
const config = {
  "*.{js,ts,tsx}": ["npm run lint:eslint", "npm run format:check"],
  "*.{css,scss}": ["npm run lint:stylelint", "npm run format:check"],
  "*.{json,md,yml,yaml}": ["npm run format:check"],
  "*.{html,vue}": ["npm run format:check"],
};
export default config;
