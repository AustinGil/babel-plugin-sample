// Transform 1: Remove this line
import { myFn } from 'my-awesome-package'
import { myFn as myFn2 } from 'my-awesome-package/index.js'
// import './import.js'

// Transform 2: Replace these function calls with static result of the function
const myVariable1 = myFn('test params')
const myVariable2 = myFn({
  test: 'params'
})
const myVariable3 = myFn`
  test: params;
`
const myVariable4 = myFn2('test params')
myFn2('test params')
const myObj = {
  prop: myFn('test params')
}

// The rest of the code
console.log(myVariable1)
console.log(myVariable2)
console.log(myVariable3)
console.log(myVariable4)
console.log(myObj.prop)