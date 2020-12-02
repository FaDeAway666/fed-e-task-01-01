// support.js
class Container {
    static of(value){
        return new Container(value)
    }
    constructor(value){
        this._value = value
    }
    map(fn){
        return Container.of(fn(this._value))
    }
}

class Maybe {
    static of(x){
        return new Maybe(x)
    }
    isNothing(){
        return this._value === null || this._value === undefined
    }
    constructor(x){
        this._value = x
    }
    map(fn){
        return this.isNothing() ? this : Maybe.of(fn(this._value))
    }
}
// module.exports = { Maybe, Container }


const fp = require('lodash/fp')
let maybe = Maybe.of([5,6,1])

// 第一题
let ex1 = (num) => {
    // 你需要实现的函数。。。
    return maybe.map(fp.map(x => fp.add(num, x)))
}
let f = ex1(2)
console.log(f._value)

// 第二题
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
    // 你需要实现的函数。。。
    return xs.map(fp.first)
}
let f2 = ex2()
console.log(f2._value)

// 第三题
let safeProp = fp.curry(function(x, o){
    return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }
let ex3 = (prop, obj) => {
    // 你需要实现的函数。。。
    return safeProp(prop, obj).map(fp.first)
}
console.log(ex3('name', user)._value)

// 第四题
let ex4 = function(n){
    return Maybe.of(n)
            .map(parseInt)._value
}
console.log(ex4('100'))