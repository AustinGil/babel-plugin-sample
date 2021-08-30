/** @typedef {import('csstype').Properties} CssStylesObject */

/**
 * @callback ConfigHandler
 * @param {{ variables: Record<string, any>, classes: Record<string, any> }} config
 * @returns {CssStylesObject}
 */

/**
 * @param  {CssStylesObject | ConfigHandler} params
 */

// eslint-disable-next-line no-unused-vars
export const myFn = (params) => {
  throw new Error('This is a build time function only');
};
