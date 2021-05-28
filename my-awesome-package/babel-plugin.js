import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss'
import postcssJs from 'postcss-js'
// import { kebabCase } from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);
const PACKAGE_NAME = pkg.name
const FILE_OUT = 'myFile.css'

const globalCssAst = postcss.root()

/**
 * @param {import('postcss').ChildNode} node
 * @returns {string}
 */
const getClassName = (node) => {
  const classMap = new Map([
    ['padding', 'p'],
    ['padding-top', 'pt'],
    ['padding-bottom', 'pb'],
    ['padding-left', 'pl'],
    ['padding-right', 'pr'],
    ['background-color', 'bg'],
  ])
  const prefix = classMap.get(node.prop) || node.prop
  return `${prefix}-${node.value}`
}

/**
 * @param {import('@babel/types').CallExpression} path
 * @param {import('@babel/core').t}
 */
function replacePathWithStatic(path, t) {
  const [firstArg] = path.node.arguments
  const rulesAlreadyAdded = new Set()
  const classNames = new Set()
  let instanceStyles

  if (t.isStringLiteral(firstArg)) {
    instanceStyles = postcss.parse(firstArg.value)
    // console.log(postcssJs.objectify(instanceStyles))
  } else if (t.isObjectExpression(firstArg)) {
    // Handle as Object
    const styles = {}
    for (const {key, value} of firstArg.properties) {
      styles[key.name] = value.value
    }
    instanceStyles = postcss().process(styles, { parser: postcssJs }).root
  } else if (t.isFunctionExpression(firstArg) || t.isArrowFunctionExpression(firstArg)) {
    // Handle as tagged template
    // console.log(firstArg)
  } else if (t.isLogicalExpression(firstArg)) {
    // Handle as tagged template
    // console.log(firstArg)
  } else {
    // BinaryExpression
    // TemplateLiteral
    // console.log(firstArg)
  }

  // Reverse order so the last instance wins in case of repeats
  instanceStyles.nodes.reverse()

  for (const node of instanceStyles.nodes) {
    const className = getClassName(node)
    const selector = `.${className}`

    // Only return class names for unique properties 
    if (!rulesAlreadyAdded.has(node.prop)) {
      classNames.add(className)
      rulesAlreadyAdded.add(node.prop)
    }
    // Only add new rules to global if they do not exist
    const alreadyInGlobal = globalCssAst.some(r => {
      return r.selector === selector
    })
    if (!alreadyInGlobal) {
      node.cleanRaws()
      const rule = postcss.rule({ selector: selector }).push(node)
      globalCssAst.push(rule)
    }
  }

  if (!classNames.size) return

  path.replaceWithSourceString(`'${Array.from(classNames.values()).join(' ')}'`)
}

export default function prtclsBabelPlugin(context) {
  let functionAlias = 'myFn';
  const t = context.types

  return {
    name: PACKAGE_NAME,
    // pre(state) {
    //   this.cache = new Map();
    // },
    post(state) {
      // console.log(this.cache);
      const stream = fs.createWriteStream(FILE_OUT, { encoding: 'utf8' });
      const data = globalCssAst.toString();
      stream.write(data)
    },
    visitor: {
      /** @see https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md */

      // Identifier(path, plugin) {
      //   console.log(path)
      // },

      ImportDeclaration(path) {
        // Remove import statement
        if ([PACKAGE_NAME, `${PACKAGE_NAME}/index`, `${PACKAGE_NAME}/index.js`].includes(path.node.source.value)) {
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
        if (path.node.callee.name !== functionAlias) return
        replacePathWithStatic(path, t)
      }
    },
  };
};
