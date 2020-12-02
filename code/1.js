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