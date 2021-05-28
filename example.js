// Transform 1: Remove this line
import { myFn } from 'my-awesome-package'
// import './import.js'

const p = 5;

// Transform 2: Replace these function calls with static result of the function
// const myVariable1 = myFn('padding: 5px; &:hover { color: blue; }')
// const myVariableX = myFn('padding: ' + p + 'px; margin: ' + p + 'px;')
// const myVariableY = myFn(`padding: ${p}px; margin: ${p}px;`)
const myVariable2 = myFn({
  margin: 'auto',
  backgroundColor: '#fff',
  '&:hover': {
    color: 'red'
  }
})
// const myVariable3 = myFn`
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
