function Promise(executor) {
  this.PromiseState = 'pending'; // fulfilled rejected
  this.PromiseResult = undefined;
  this.callbacks = [];
  const resolve = (data) => {
    if (this.PromiseState != 'pending') return
    this.PromiseState = 'fulfilled';
    this.PromiseResult = data;
    this.callbacks.forEach(item => {
      item.onFulfilled(this.PromiseResult);
    })
  }
  const reject = (data) => {
    if (this.PromiseState != 'pending') return
    this.PromiseState = 'rejected';
    this.PromiseResult = data;
    this.callbacks.forEach(item => {
      item.onRejected(this.PromiseResult);
    })
  }
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  return new Promise((resolve, reject) => {
    if (typeof onFulfilled !== 'function') {
      onFulfilled = reason => reason
    }
    if (typeof onRejected !== 'function') {
      onRejected = value => value
    }
    // 重复代码封装
    const type = (typeF) => {
      try {
        // 获取回调函数的执行结果
        const result = typeF(this.PromiseResult);
        if (result instanceof Promise) {
          result.then(v => {
            resolve(v);
          }, r => {
            reject(r);
          })
        } else {
          resolve(result);
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    }
    if (this.PromiseState === 'fulfilled') {
      type(onFulfilled);
    }
    if (this.PromiseState === 'rejected') {
      type(onRejected);
    }
    if (this.PromiseState === 'pending') {
      this.callbacks.push({
        onFulfilled() {
          type(onFulfilled);
        },
        onRejected() {
          type(onRejected);
        }
      })
    }
  })
}

// 封装 catch 方法
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}