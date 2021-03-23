import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import babel from '@babel/core';
// import babel from '@babel/types';
// import { types } from '@babel/core';
// import template from '@babel/template';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);
const PACKAGE_NAME = pkg.name // "p2"

export default function prtclsBabelPlugin({ types: t }) {
  let functionAlias = 'css';

  return {
    name: PACKAGE_NAME,
    visitor: {

      // importNamespaceSpecifier
      ImportDeclaration(path) {
        // Remove import statement
        if (path.node.source.value === PACKAGE_NAME) {
          const { specifiers } = path.node;
          const spec = specifiers[0];
          if (spec.type === 'ImportSpecifier') {
            functionAlias = spec.local.name;
          }
          // console.log(specifiers)
          path.remove();
        }
      },

      // FunctionDeclaration(path) {
      // FunctionExpression(path) {
      // AssignmentExpression(path) {
      VariableDeclaration(path) {
        console.log(path)
        // path.replaceWith('yo');
        path.replaceWithSourceString('yo')
      }

    },
  };
};
