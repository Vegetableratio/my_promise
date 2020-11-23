/*
1.整体函数结构

*/
(function () {
    const PENDING = 'pending';
    const RESOLVED = 'resolved';
    const REJECTED = 'rejected';

    /*
    * MyPromise构造函数
    * @executor:执行器函数
    * @status:给Promise对象指定status属性,初始值为pendding
    * @data:给Promise指定一个用于存储结果数据的属性
    * @callback:每个元素的结构:{ onResolved(){}; onRejected(){}}
    */
    function MyPromise(executor) {
        const _self = this;
        _self.status = PENDING;
        _self.data = undefined;
        _self.callbacks = [];

        function resolve(value) {
            // promise状态只能改一次
            if (_self.status !== PENDING) return;
            // 将状态改为resolved
            _self.status = RESOLVED;
            // 保存数据
            _self.data = value;
            // 如果有待执行的callback函数,立即异步执行回调
            if (_self.callbacks.length > 0) {
                // 放入队列执行所有成功的回调
                setTimeout(() => {
                    _self.callbacks.forEach(callbackObjs => {
                        callbackObjs.onResolved(value)
                    })
                })

            }
        }

        function reject(reason) {
            // promise状态只能改一次
            if (_self.status !== PENDING) return;
            // 将状态改为resolved
            _self.status = REJECTED;
            // 保存数据
            _self.data = reason;
            // 如果有待执行的callback函数,立即异步执行回调
            if (_self.callbacks.length > 0) {
                // 放入队列执行所有成功的回调
                setTimeout(() => {
                    _self.callbacks.forEach(callbackObjs => {
                        callbackObjs.onRejected(reason)
                    })
                })
            }
        }

        // 立即同步执行executor
        try {
            executor(resolve, reject)
        } catch (err) {
            // 如果执行器执行时抛异常.promise变为rejected状态
            reject(err)
        }
    }

    // Promise原型对象的then()
    // 指定成功和失败的的回调函数
    // 返回一个新的promise
    MyPromise.prototype.then = function (onResolved, onRejected) {
        const _self = this;
        // 返回一个新的promise对象
        return new Promise((resolve, reject) => {
            if (_self.status === PENDING) {
                // 假设当前状态还是pending状态,将回调函数保存起来
                _self.callbacks.push({
                    onResolved,
                    onRejected
                })
            } else if (_self.status === RESOLVED) {
                setTimeout(() => {
                    /*
                    * 1.如果抛出异常,return的promise就会失败,reason就是error
                    * 2.如果回调函数返回非promise,return的promise就会成功,value就是返回的值
                    * 3.如果回调函数返回的是promise,return的promise结果就是这个promise的结果
                    */
                    try {
                        const result = onResolved(_self.data);
                        if (result instanceof MyPromise) {
                            result.then(
                                value => resolve(value),
                                reason => reject(reason)
                            )
                        } else {
                            resolve(result)
                        }
                    } catch (err) {
                        reject(err)
                    }
                })
            } else {
                // rejected
                setTimeout(() => {
                    onRejected(_self.data)
                })
            }
        })
    };

    // Promise原型对象的catch()
    // 指定失败的的回调函数
    // 返回一个新的promise
    MyPromise.prototype.catch = function (onRejected) {
    };

    // Promise函数对象的resolve方法
    // 返回一个指定结果的成功的promise
    MyPromise.resolve = function (valve) {
    };

    // Promise函数对象的reject方法
    // 返回一个指定reason的失败的promise
    MyPromise.reject = function (reason) {
    };

    // Promise函数对象的all方法
    // 返回一个promise,只有当所有promise都成功时才成功,否则失败
    MyPromise.all = function (promises) {
    };

    // Promise函数对象的race方法
    // 返回一个promise,其结果由第一个完成的promise决定
    MyPromise.race = function (promises) {
    };

    // 向外暴露函数
    window.MyPromise = MyPromise;
})(window);
