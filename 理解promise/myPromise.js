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
  const _this = this;
  return new Promise((resolve, reject) => {
    if (this.PromiseState === 'fulfilled') {
      try {
        // 获取回调函数的执行结果
        const result = onFulfilled(this.PromiseResult);
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
        reject(e);
      }
    }
    if (this.PromiseState === 'rejected') {
      try {
        // 获取回调函数的执行结果
        const result = onRejected(this.PromiseResult);
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
        reject(e);
      }
    }
    if (this.PromiseState === 'pending') {
      this.callbacks.push({
        // onFulfilled, 
        // onRejected 
        onFulfilled() {
          try {
            // 获取回调函数的执行结果
            const result = onFulfilled(_this.PromiseResult);
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
            reject(e);
          }
        },
        onRejected() {
          try {
            // 获取回调函数的执行结果
            const result = onRejected(_this.PromiseResult);
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
            reject(e);
          }
        }
      })
    }
  })

}