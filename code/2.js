const fp = require('lodash/fp')
// 数据：horsepower 马力，dollar_value 价格，in_stock 库存
const cars = [
    { name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true },
    { name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false },
    { name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
    { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
    { name: 'Aston Martin One-77', horsepower: 750, dollar_value: 185000, in_stock: true },
    { name: 'Pagani Huayra', horsepower: 700, dollar_value: 130000, in_stock: false }
]

// 第一题
let lastInstock = fp.flowRight(fp.prop('in_stock'), fp.last)
console.log(lastInstock(cars))

// 第二题
let firstName = fp.flowRight(fp.prop('name'), fp.first);
console.log(firstName(cars))

// 第三题
let _average = function(xs){
    return fp.reduce(fp.add, 0, xs) / xs.length
}
let average = fp.flowRight(_average,fp.map(fp.prop('dollar_value')))
console.log(average(cars))

// 第四题
let _underscore = fp.replace(/\W+/g, '_') // 无须改动，并在 sanitizeNames 中使用它
let sanitizeNames = fp.map(fp.flowRight(_underscore, fp.toLower, fp.prop('name')))

console.log(sanitizeNames(cars))