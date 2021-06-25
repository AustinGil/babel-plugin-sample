/**
 * Converts a string from camelCase to kebab-case
 *
 * @param {string} str camelCase string
 * @returns {string} snake_case string
 */
export const kebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z]+)/g, (...parts) => `${parts[1]}-${parts[2]}`)
    .toLowerCase();
};
