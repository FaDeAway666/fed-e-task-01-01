# 模块一：函数式编程与 JS 异步编程、手写 Promise参考答案

#### 简答题

### 一、谈谈你是如何理解 JS 异步编程的，EventLoop、消息队列都是做什么的，什么是宏任务，什么是微任务？

由于JS执行环境是单线程的，在代码执行的过程中，如果遇到耗时长的任务，会发生程序的阻塞，为解决这个问题，JS将任务执行模式分为同步和异步

异步模式可以在处理耗时长的任务时，开启这个任务就立即执行下一个任务，不会等待这个任务结束，这样解决了代码会发生阻塞的问题

EventLoop是JS异步编程的实现方式，当一个异步任务有了执行结果以后，其回调函数会被放入消息队列（也是event的队列）当中，当主线程所有的同步任务结束完毕后，再去读取消息队列，取出其中的异步任务的回调函数进行执行

主线程执行完同步代码，再去从消息队列取出异步任务对应的回调函数进行执行，这个过程是不断循环的，也称为EventLoop

宏任务和微任务是消息队列中的两种不同的事件，在主线程读取消息队列的时候，先会去读取微任务队列并执行其中的任务，微任务队列为空以后，再会去宏任务队列，读取宏任务进行执行

微任务包括Promise，MutationObserver，node环境中有process.nextTick，但没有MutationObserver

宏任务包括IO操作，定时器（setTimeout，setInterval），requestAnimationFrame，node环境中还有setImmediate，但没有requestAnimationFrame

------

#### 代码题

### 一、将下面异步代码使用 Promise 的方式改进

```
setTimeout(function() {
    var a = 'hello'
    setTimeout(function() {
        var b = 'lagou'
        setTimeout(function() {
            var c = 'I ❤️ U'
            console.log(a + b + c)
        }, 10);
    }, 10);
}, 10);
```

> 参考代码：

```
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('hello')    
    }, 10);
}).then(value => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(value + 'lagou')
        }, 10);
    })
}).then(value => {
    setTimeout(() => {
        console.log(value + 'I ❤️ U')
    }, 10);
})
```

------

### 二、基于以下代码完成下面的四个练习

```
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
```

#### 练习1：使用组合函数 fp.flowRight() 重新实现下面这个函数

```
let isLastInStock = function(cars){
    // 获取最后一条数据
    let last_car = fp.last(cars)
    // 获取最后一条数据的 in_stock 属性值
    return fp.prop('in_stock', last_car)
}
```

> 先定义获取最后一条数据的函数，再定义获取某个对象中的 in_stock 属性的函数，再用 fp.flowRight 组合函数

```
let lastInstock = fp.flowRight(fp.prop('in_stock'), fp.last)
console.log(lastInstock(cars))
```

#### 练习2：使用 fp.flowRight()、fp.prop() 和 fp.first() 获取第一个 car 的 name

> 先定义获取第一条数据的函数，再定义获取某个对象中的 name 属性的函数，再用 fp.flowRight 组合函数

```
let firstName = fp.flowRight(fp.prop('name'), fp.first);
console.log(firstName(cars))
```

#### 练习3：使用帮助函数 _average 重构 averageDollarValue，使用函数组合的方式实现

```
let _average = function(xs){
    return fp.reduce(fp.add, 0, xs) / xs.length
}
```

> 先定义获取某个对象中的 dollar_value 属性的函数，将该函数作为 fp.map 的数组元素处理函数，再用 fp.flowRight 组合函数

```
let average = fp.flowRight(_average,fp.map(fp.prop('dollar_value')))
console.log(average(cars))
```

#### 练习4：使用 flowRight 写一个 sanitizeNames() 函数，返回一个下划线连续的小写字符串，把数组中的 name 转换为这种形式，例如：sanitizeNames(["Hello World"]) => ["hello_world"]

```
let _underscore = fp.replace(/\W+/g, '_') // 无须改动，并在 sanitizeNames 中使用它
```

> 先定义获取某个对象中的 name 属性的函数，再定义转化为小写的函数，再将空格和下划线替换，,再用 fp.flowRight 组合函数

```
let sanitizeNames = fp.map(fp.flowRight(_underscore, fp.toLower, fp.prop('name')))

console.log(sanitizeNames(cars))
```

------

### 三、基于下面提供的代码，完成后续的四个练习

```
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
module.exports = { Maybe, Container }
```

#### 练习1：使用 fp.add(x, y) 和 fp.map(f,x) 创建一个能让 functor 里的值增加的函数 ex1

```
const fp = require('lodash/fp')
const {Maybe, Container} = require('./support')
let maybe = Maybe.of([5,6,1])
let ex1 = () => {
    // 你需要实现的函数。。。
}
```

> 函子对象的 map 方法可以运行一个函数对值进行处理，函数的参数为传入 of 方法的参数；接着对传入的整个数组进行遍历，并对每一项执行 fp.add 方法

```
let ex1 = (num) => {
    // 你需要实现的函数。。。
    return maybe.map(fp.map(x => fp.add(num, x)))
}
let f = ex1(2)
console.log(f._value)
```

#### 练习2：实现一个函数 ex2，能够使用 fp.first 获取列表的第一个元素

```
const fp = require('lodash/fp')
const {Maybe, Container} = require('./support')
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
    // 你需要实现的函数。。。
}
```

> 解答如下：

```
let ex2 = () => {
    // 你需要实现的函数。。。
    return xs.map(fp.first)
}
let f = ex2()
console.log(f._value)
```

#### 练习3：实现一个函数 ex3，使用 safeProp 和 fp.first 找到 user 的名字的首字母

```
const fp = require('lodash/fp')
const {Maybe, Container} = require('./support')
let safeProp = fp.curry(function(x, o){
    return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }
let ex3 = () => {
    // 你需要实现的函数。。。
}
```

> 调用 ex3 函数传入 user 对象，safeProp 是经过柯里化处理的，可以先传“属性”参数，后传“对象”参数。safeProp 函数处理后返回 user 的值，再调用fp.first 获取首字母

```
let ex3 = (prop, obj) => {
    // 你需要实现的函数。。。
    return safeProp(prop, obj).map(fp.first)
}
console.log(ex3('name', user)._value)
```

#### 练习4：使用 Maybe 重写 ex4，不要有 if 语句

```
const fp = require('lodash/fp')
const {Maybe, Container} = require('./support')
let ex4 = function(n){
    if(n){
        return parseInt(n)
    }
}
```

> MayBe 函子用来处理外部的空值情况，防止空值的异常，拿到函子的值之后进行 parseInt 转化

```
let ex4 = function(n){
    return Maybe.of(n)
            .map(parseInt)._value
}
```

------

### 四、手写实现 MyPromise 源码

要求：尽可能还原 Promise 中的每一个 API，并通过注释的方式描述思路和原理。【参考代码】

```javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  // 构造时传入执行器函数，执行器函数接收两个参数，resolve和reject方法
  constructor (executor) {
    try {
      executor(this.resolve, this.reject)
    }catch (e) {
      this.reject(e)
    }
  }
  // 定义状态属性
  status = PENDING
  // 定义成功后的value值
  value = undefined
  // 定义错误属性
  err = undefined
  // 定义resolve回调队列
  onFulfilled = []
  // 定义reject回调队列
  onRejected = []

  // resolve 原型方法
  resolve = (value) => {
    // 如果状态已更改，直接返回
    if(this.status !== PENDING) return
    // resolve方法的核心目的，就是将pending状态变为fulfilled
    this.status = FULFILLED
    // 存储成功之后的值
    this.value = value
    // 在状态变为fulfilled后，依次执行resolve回调队列中的回调函数
    while(this.onFulfilled.length) this.onFulfilled.shift()()
  }

  reject = (err) => {
    // 如果状态已更改，直接返回
    if (this.status !== PENDING) return

    // reject方法的核心目的，就是将pending状态变为rejected
    this.status = REJECTED
    // 存储错误信息
    this.err = err
    // 在状态变为rejected后，依次执行reject回调队列中的回调函数
    while(this.onRejected.length) this.onRejected.shift()()
  }
  // then方法定义在原型对象上，接收一个resolve回调，一个reject回调
  then (onFulfilled, onRejected) {
    // 判断是否传递了resolve回调，如果没有传递，则默认传递一个接收一个value参数的函数，并将其返回出去
    onFulfilled = onFulfilled ? onFulfilled : value => value;
    // 判断是否传递了reject回调，如果没有传递，则默认传递一个接收一个err参数的函数，并将其已Error形式返回出去
    onRejected = onRejected ? onRejected : err => new Error(err)
    // 为了实现then方法的链式调用，应返回一个myPromise对象
    let promise = new MyPromise((resolve, reject) => {

      if(this.status === FULFILLED) {
        // 这里的settimeout只是为了将内部代码放到同步代码的后面执行，为了获得promise对象
        setTimeout(() => {
          try {
            // 当status为fulfilled时，执行当前传入的resolve回调，并将成功的值传入回调
            let result = onFulfilled(this.value)
            // 处理resolve回调的返回值，如果是一个promise对象，则继续调用then，若是普通值，则将其直接返回
            resolvePromise(promise, result, resolve, reject)
          }catch (e) {
            // 出现错误，调用reject方法变更状态
            reject(e)
          }
            
        }, 0);
      }
  
      else if(this.status === REJECTED) {
        setTimeout(() => {
          try {
            // 当status为rejected时，执行当前传入的reject回调，并将错误信息传入回调
            let result = onRejected(this.err)
            // 处理resolve回调的返回值
            resolvePromise(promise, result, resolve, reject)
          }catch (e) {
            reject(e)
          }
            
        }, 0);
      }
         
      else {
        // 若status处于pending状态，则将当前的resolve回调和reject回调，经过一个函数包装，存入相应的回调队列
        // 当后续状态发生改变的时候，再去执行这些回调
        this.onFulfilled.push(() => {
          // 此函数与之前的用法一致
          setTimeout(() => {
            try {
              let result = onFulfilled(this.value)
            
              resolvePromise(promise, result, resolve, reject)
            }catch (e) {
              reject(e)
            }
              
          }, 0);
        })
        this.onRejected.push(() => {
          
          setTimeout(() => {
            try {
              let result = onRejected(this.err)
            
              resolvePromise(promise, result, resolve, reject)
            }catch (e) {
              reject(e)
            }
              
          }, 0);
        })
      }
    })
    return promise
  }
  // catch方法，相当于不传递成功回调的then方法，只接收一个reject回调
  catch (onRejected) {
    return this.then(undefined, onRejected)
  }
  // finally方法，接收一个回调函数作为参数
  finally (callback) {
    // 为了实现finally方法后仍可以调用then方法，因此使用this.then返回一个promise
    return this.then(value => {
      // finally方法的执行结果都用MyPromise.resolve去将其转换成一个fulfilled的promise对象
      // 执行完回调后，将调用finally之前的promise结果传递下去
      return MyPromise.resolve(callback()).then(() => value )
    }, err => {
      return MyPromise.resolve(callback()).then(() => {throw err})
    })
      
  }
  // MyPromise.resolve，接收一个值作为参数
  static resolve (value) {
    // 如果接收的值是promise对象，则原封不动返回
    if(value instanceof MyPromise) {
      return value
    } else {
      // 如果接收的值是一个其他值，则将其转换成一个fulfilled的promise对象
      return new MyPromise(resolve => resolve(value))
    }
  }

  // MyPromise.reject，接收一个值作为参数
  static reject (err) {
    // 将这个值转换成一个rejected的promise对象
    return new MyPromise((resolve, reject) => reject(err))
  }

  // all 方法，接收一个数组，返回一个promise对象
  static all (array) {
    let result = [] // 定义结果数组
    let index = 0 // 定义执行位置
    return new MyPromise((resolve, reject) => {
      // 将参数数组的执行结果存放至结果数组中
      function addData (i, data) {
        result[i] = data
        index++
        // 当参数数组中所有元素都经过一次执行后，返回最终的结果
        if (index === array.length) resolve(result)
      }
      // 遍历数组，如果值为promise对象，则调用其then方法，使用addData函数接收其成功的返回值，如果中间出现错误，则结束循环，抛出错误
      for (let i = 0; i < array.length; i++) {
        if(array[i] instanceof MyPromise) {
          array[i].then(value => addData(i, value), err => reject(err))
        } else {
          // 如果值为其他类型，则直接将其添加至结果数组
          addData(i, array[i])
        }
      }
    })
  }

  // race方法，接收一个数组，返回promise对象
  static race (array) {
    return new MyPromise((resolve, reject) => {
      // 遍历数组，只要有一个元素resolve了，直接返回结果
      for (let i = 0; i < array.length; i++) {
        if(array[i] instanceof MyPromise) {
          array[i].then(value => resolve(value), err => reject(err))
        } else {
          resolve(array[i])
        }
      }
    })
  }
}
// 处理回调返回值的函数
function resolvePromise(promise, obj, resolve, reject) {
  if (obj === promise) {
    return reject(new TypeError('chain promise error'))
  }

  if(obj instanceof MyPromise) {
    obj.then(resolve, reject)
  } else {
    resolve(obj)
  }
}

module.exports = MyPromise
```

