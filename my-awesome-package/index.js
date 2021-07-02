/** @typedef {import('csstype').Properties} CssStylesObject */

/**
 * @callback ConfigHandler
 * @param {{ variables: {}, classes: {} }} config
 * @returns {CssStylesObject}
 */

/**
 * @param  {CssStylesObject | ConfigHandler} params
 */

// @ts-ignore
// eslint-ignore-next-line no-unused-vars
export const myFn = (params) => {
  throw new Error('This is a build time function only');
};
