import ActionTypes from "./utils/actionTypes.js";
import isPlainObject from "./utils/isPlainObject.js";

export default function createStore(reducer, preloadedState, enhancer) {
  // 如果第二个参数`preloadedState`是函数，并且第三个参数`enhancer`是undefined，把它们互换一下。
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = undefined;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error("Expected the enhancer to be a function.");
    }
    // enhancer 也就是`Redux.applyMiddleware`返回的函数
    // createStore 的 args 则是 `reducer, preloadedState`
    /**
     (createStore) =>
      (...args) => {
        const store = createStore(...args);
        return {
          ...store,
          dispatch,
        };
      };
     */
    // 最终返回增强的store对象。
    return enhancer(createStore)(reducer, preloadedState);
  }

  // 当前的 reducer 函数
  let currentReducer = reducer;
  // 当前state
  let currentState = preloadedState;
  // 当前的监听数组函数
  let currentListeners = [];
  // 下一个监听数组函数
  let nextListeners = currentListeners;
  // 是否正在dispatch中
  let isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function getState() {
    // 判断正在dispatch中，则报错
    if (isDispatching) {
      throw new Error(
        "You may not call store.getState() while the reducer is executing. " +
          "The reducer has already received the state as an argument. " +
          "Pass it down from the top reducer instead of reading it from the store."
      );
    }
    // 返回当前的state
    return currentState;
  }

  function subscribe(listener) {
    // 订阅参数校验不是函数报错
    if (typeof listener !== "function") {
      throw new Error("Expected the listener to be a function.");
    }
    // 正在dispatch中，报错
    if (isDispatching) {
      throw new Error(
        "You may not call store.subscribe() while the reducer is executing. " +
          "If you would like to be notified after the store has been updated, subscribe from a " +
          "component and invoke store.getState() in the callback to access the latest state. " +
          "See https://redux.js.org/api-reference/store#subscribelistener for more details."
      );
    }
    // 订阅为 true
    let isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    // 返回一个取消订阅的函数
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      // 正在dispatch中，则报错
      if (isDispatching) {
        throw new Error(
          "You may not unsubscribe from a store listener while the reducer is executing. " +
            "See https://redux.js.org/api-reference/store#subscribelistener for more details."
        );
      }
      // 订阅为 false
      isSubscribed = false;

      ensureCanMutateNextListeners();
      //   找到当前监听函数
      const index = nextListeners.indexOf(listener);
      //   在数组中删除
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }

  function dispatch(action) {
    // 判断action是否是对象，不是则报错
    if (!isPlainObject(action)) {
      throw new Error(
        "Actions must be plain objects. " +
          "Use custom middleware for async actions."
      );
    }
    // 判断action.type 是否存在，没有则报错
    if (typeof action.type === "undefined") {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
          "Have you misspelled a constant?"
      );
    }
    // 不是则报错
    if (isDispatching) {
      throw new Error("Reducers may not dispatch actions.");
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      // 调用完后置为 false
      isDispatching = false;
    }
    //  把 收集的函数拿出来依次调用
    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
    // 最终返回 action
    return action;
  }

  function replaceReducer(nextReducer) {}

  function observable() {}

  // ActionTypes.INIT @@redux/INITu.v.d.u.6.r
  dispatch({ type: ActionTypes.INIT });

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    // [$$observable]: observable,
  };
}
