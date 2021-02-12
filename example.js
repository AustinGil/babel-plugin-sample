// Transform 1: Remove this line
import { myFn } from 'my-awesome-package'

// Transform 2: Replace these function calls with static result of the function
const myVariable1 = myFn('test params')
const myVariable2 = myFn({
  test: 'params'
})
const myVariable3 = myFn`
  test: params;
`

// The rest of the code
console.log(myVariable1)
console.log(myVariable2)
console.log(myVariable3)