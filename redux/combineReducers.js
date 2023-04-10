/**
 * 合并多个reducer为一个函数combination
 * @param {*} reducers 
 * @returns 
 */
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];

    // 省略一些开发环境判断的代码...

    if (typeof reducers[key] === "function") {
      finalReducers[key] = reducers[key];
    }
  }

  // 经过一些处理后得到最后的finalReducerKeys
  const finalReducerKeys = Object.keys(finalReducers);

  // 省略一些开发环境判断的代码...

  return function combination(state = {}, action) {
    // ... 省略开发环境的一些判断

    // 用 hasChanged变量 记录前后 state 是否已经修改
    let hasChanged = false;
    // 声明对象来存储下一次的state
    const nextState = {};
    //遍历 finalReducerKeys
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      // 执行 reducer
      const nextStateForKey = reducer(previousStateForKey, action);

      // 省略容错代码 ...

      nextState[key] = nextStateForKey;
      // 两次 key 对比 不相等则发生改变
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    // 最后的 keys 数组对比 不相等则发生改变
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}
