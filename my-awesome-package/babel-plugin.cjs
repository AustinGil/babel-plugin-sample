const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const postcssJs = require('postcss-js');
// import { kebabCase } from './utils.js'

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);
const PACKAGE_NAME = pkg.name;
let GLOBAL_SETTINGS = {};
const classMap = new Map([
  ['background', 'bg'],
  ['background-attachment', 'bg-a'],
  ['background-color', 'bg-c'],
  ['background-image', 'bg-i'],
  ['background-position', 'bg-p'],
  ['background-repeat', 'bg-r'],
  ['border', 'b'],
  ['border-bottom', 'b-b'],
  ['border-bottom-color', 'b-b-c'],
  ['border-bottom-style', 'b-b-s'],
  ['border-bottom-width', 'b-b-w'],
  ['border-color', 'b-c'],
  ['border-left', 'b-l'],
  ['border-left-color', 'b-l-c'],
  ['border-left-style', 'b-l-s'],
  ['border-left-width', 'b-l-w'],
  ['border-right', 'b-r'],
  ['border-right-color', 'b-r-c'],
  ['border-right-style', 'b-r-s'],
  ['border-right-width', 'b-r-w'],
  ['border-style', 'b-s'],
  ['border-top', 'b-t'],
  ['border-top-color', 'b-t-c'],
  ['border-top-style', 'b-t-s'],
  ['border-top-width', 'b-t-w'],
  ['border-width', 'b-w'],
  // ['clear', 'c'],
  // ['clip', 'c'],
  ['color', 'c'],
  ['cursor', 'cur'],
  ['display', 'd'],
  // ['filter', 'f'],
  // ['float', 'f'],
  ['font', 'f'],
  ['font-family', 'f-f'],
  ['font-size', 'f-s'],
  ['font-variant', 'f-v'],
  ['font-weight', 'f-w'],
  ['height', 'h'],
  ['left', 'l'],
  ['letter-spacing', 'l-s'],
  ['line-height', 'l-h'],
  ['list-style', 'l-s'],
  ['list-style-image', 'l-s-i'],
  ['list-style-position', 'l-s-p'],
  ['list-style-type', 'l-s-t'],
  ['margin', 'm'],
  ['margin-bottom', 'm-b'],
  ['margin-left', 'm-l'],
  ['margin-right', 'm-r'],
  ['margin-top', 'm-t'],
  ['overflow', 'o'],
  ['padding', 'p'],
  ['padding-bottom', 'p-b'],
  ['padding-left', 'p-l'],
  ['padding-right', 'p-r'],
  ['padding-top', 'p-t'],
  ['page-break-after', 'p-b-a'],
  ['page-break-before', 'p-b-b'],
  ['position', 'pos'],
  ['stroke-dasharray', 's-d'],
  ['stroke-dashoffset', 's-d'],
  ['text-align', 't-a'],
  ['text-decoration', 't-d'],
  ['text-indent', 't-i'],
  ['text-transform', 't-t'],
  ['top', 't'],
  ['vertical-align', 'v-a'],
  ['visibility', 'v'],
  ['width', 'w'],
  ['z-index', 'z-i'],
]);

const globalCssAst = postcss.root();
const mediaQueriesAst = postcss.root();

/**
 * @param {import('postcss').ChildNode} node
 * @returns {{ className: string, selector: string}
 */
const getClassAndSelector = (node) => {
  if (node.parent.name === 'media') {
    // console.log(node.parent);
    // mediaQueriesAst.append(node);
    let classStr = node.parent.params
      .replace(/ and /g, '\\&')
      .replace('only ', 'o_')
      .replace('screen', 's')
      .replace(/\(min-width: ?/g, '>')
      .replace(/\(max-width: ?/g, '<')
      .replace(')', '');
    console.log(classStr);
  }
  const prefix = classMap.get(node.prop) || node.prop;
  const suffix = node.value.replace(/, /g, ',').replace(/ /g, '_');
  let className = `${prefix}_${suffix}`;
  let selector = className.replace(/([#()+,.])/g, '\\$1');

  if (node.parent !== node.root() && node.parent.type === 'rule') {
    const pseudo = node.parent.selector.slice(2);
    className = `${pseudo}:${className}`;
    selector = `${pseudo}\\:${selector}:${pseudo}`;
  }

  return { className, selector: `.${selector}` };
};
/**
 *
 * @param {import('@babel/types').Node[]} nodes
 * @param t
 */
function getStylesFromObject(nodes, t) {
  const styles = {};
  for (const { key, value } of nodes) {
    if (t.isObjectExpression(value)) {
      styles[key.value] = getStylesFromObject(value.properties, t);
      continue;
    }
    styles[key.name] = value.value;
  }
  return styles;
}

/**
 * @param {import('@babel/types').CallExpression} path
 * @param {import('@babel/core').t}
 * @param t
 */
async function replacePathWithStatic(path, t) {
  const [firstArg] = path.node.arguments;
  const rulesAlreadyAdded = new Set();
  const classNames = new Set();
  let instanceStyles;
  const mediaQueries = [];

  if (t.isStringLiteral(firstArg)) {
    instanceStyles = postcss.parse(firstArg.value);
    // console.log(postcssJs.objectify(instanceStyles))
  } else if (t.isObjectExpression(firstArg)) {
    // Handle as Object
    const styles = getStylesFromObject(firstArg.properties, t);
    const results = postcss().process(styles, { parser: postcssJs });

    // console.log(styles)
    // console.log(results.root)
    instanceStyles = results.root;

    // console.log(postcss().process(styles, { parser: postcssJs }))
  } else if (
    t.isFunctionExpression(firstArg) ||
    t.isArrowFunctionExpression(firstArg)
  ) {
    // Handle as tagged template
    // console.dir(path);
    // for (const thing in firstArg) {
    //   console.log(thing);
    // }

    const sourceCode = path.getSource();
    const functionDecl = sourceCode.slice(sourceCode.indexOf('('));

    const styles = eval(functionDecl + `(${JSON.stringify(GLOBAL_SETTINGS)})`);

    const results = postcss().process(styles, { parser: postcssJs });

    instanceStyles = results.root;

    // return;
  } else if (t.isLogicalExpression(firstArg)) {
    // Handle as tagged template
    // console.log(firstArg)
  } else {
    // BinaryExpression
    // TemplateLiteral
    // console.log(firstArg);
  }

  // Reverse order so the last instance wins in case of repeats
  instanceStyles.nodes.reverse();

  // console.log(instanceStyles.nodes[1].selectors)

  // instanceStyles.walkDecls()
  // instanceStyles.walkAtRules((rule) => {
  //   console.log(rule)
  // })
  // instanceStyles.walkRules((rule) => {
  //   console.log(rule)
  // })
  instanceStyles.walkDecls((node) => {
    // TODO: Detect media queries
    const { className, selector } = getClassAndSelector(node);

    // Only return class names for unique properties
    if (!rulesAlreadyAdded.has(node.prop)) {
      classNames.add(className);
      rulesAlreadyAdded.add(node.prop);
    }
    // Only add new rules to global if they do not exist
    const alreadyInGlobal = globalCssAst.some((r) => {
      return r.selector === selector;
    });
    if (!alreadyInGlobal) {
      node.cleanRaws();
      const rule = postcss.rule({ selector: selector }).push(node);
      globalCssAst.push(rule);
    }
    // }
  });

  if (!classNames.size) return;

  path.replaceWithSourceString(`'${[...classNames.values()].join(' ')}'`);
}

const DEFAULT_SETTINGS = {
  variables: {},
  classes: {},
};
/**
 * @param {typeof DEFAULT_SETTINGS & {}} [settings=DEFAULT_SETTINGS]
 * @returns {Function}
 */
module.exports = (settings = DEFAULT_SETTINGS) => {
  Object.assign(GLOBAL_SETTINGS, DEFAULT_SETTINGS, settings);

  /**
   * @param context
   */
  // @ts-ignore
  return function prtclsBabelPlugin(context) {
    let functionAlias = 'myFn';
    const t = context.types;

    return {
      name: PACKAGE_NAME,
      // pre(state) {
      //   this.cache = new Map();
      // },
      post(state) {
        // console.log(this.cache);

        const stream = fs.createWriteStream(
          path.join(__dirname, `${PACKAGE_NAME}.css`),
          {
            encoding: 'utf8',
          }
        );
        const data = globalCssAst.toString();
        stream.write(data);
        stream.end();
      },
      visitor: {
        /** @see https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md */

        // Identifier(path, plugin) {
        //   console.log(path)
        // },

        ImportDeclaration(path) {
          // Remove import statement
          if (
            [
              PACKAGE_NAME,
              `${PACKAGE_NAME}/index`,
              `${PACKAGE_NAME}/index.js`,
            ].includes(path.node.source.value)
          ) {
            const { specifiers } = path.node;
            const spec = specifiers[0];
            if (spec.type === 'ImportSpecifier') {
              functionAlias = spec.local.name;
            }
            path.remove();
          }
        },

        /**
         * @param {import('@babel/types').CallExpression} path
         */
        CallExpression(path) {
          if (path.node.callee.name !== functionAlias) return;
          replacePathWithStatic(path, t);
        },
      },
    };
  };
};
