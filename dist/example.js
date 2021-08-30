"use strict";

// Transform 1: Remove this line
// import './import.js'
var p = 5; // const myVariable1 = myFn('padding: 5px; &:hover { color: blue; }');
// const myVariableFunc = myFn((config) => {
//   return {
//     padding: config.variables.size2,
//     ...config.classes.btn,
//     transition: 'all 0.3s ease',
//     '&:hover': {
//       color: 'blue',
//     },
//     bp1: {
//       padding: config.variables.size4,
//     },
//   };
// });
// const myVariableX = myFn('padding: ' + p + 'px; margin: ' + p + 'px;')
// const myVariableY = myFn(`padding: ${p}px; margin: ${p}px;`)

var myVariable2 = 'f-w_bold m_10px'; // const myVariable3 = myFn`
//   border-radius: ${.5}rem;
//   text-align: center;
//   &:hover {
//     color: red;
//   }
//   @media (min-width: 1024px) {
//     padding: 1.5rem 2.5rem;
//     width: 13rem;
//   }
// `
// const myVariable3 = myFn(t => `
// border-radius: ${.5}rem;
// text-align: center;
// &:hover {
//   color: red;
// }
// @media (min-width: 1024px) {
//   padding: 1.5rem 2.5rem;
//   width: 13rem;
// }
// `)
// const myVariableFunct = myFn(function (t) {
//   return `
//     border-radius: ${.5}rem;
//     text-align: center;
//     &:hover {
//       color: red;
//     }
//     @media (min-width: 1024px) {
//       padding: 1.5rem 2.5rem;
//       width: 13rem;
//     }
//   `
// })
// // const myVariable4 = myFn2('test params')
// // myFn2('test params')
// const myObj = {
//   prop: myFn('padding: 5px;')
// }
// const localFn = () => 'local fn'
// const localVar = localFn()
// const myVariable5 = myFn('padding-top: 5px; padding: 2px;')
// // The rest of the code
// console.log(myVariable1)
// console.log(myVariable2)
// console.log(myVariable3)
// console.log(myVariable4)
// console.log(myObj.prop)
// console.log(localVar)
// export const myExport = myFn('padding: 5px;')
// export default myFn('padding: 5px;')