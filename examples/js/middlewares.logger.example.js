function thunkMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState);
    }

    console.log("will dispatch--0--next, action:", next, action);
    return next(action);
  };
}

function logger1({ getState }) {
  return (next) => (action) => {
    console.log("will dispatch--1--next, action:", next, action);

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);

    console.log("state after dispatch--1", getState());

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };
}

function logger2({ getState }) {
  return function (next) {
    return function (action) {
      console.log("will dispatch--2--next, action:", next, action);

      // Call the next dispatch method in the middleware chain.
      const returnValue = next(action);

      console.log("state after dispatch--2", getState());

      // This will likely be the action itself, unless
      // a middleware further in chain changed it.
      return returnValue;
    };
  };
}

function logger3({ getState }) {
  return function (next) {
    return function (action) {
      console.log("will dispatch--3--next, action:", next, action);

      // Call the next dispatch method in the middleware chain.
      const returnValue = next(action);

      console.log("state after dispatch--3", getState());

      // This will likely be the action itself, unless
      // a middleware further in chain changed it.
      return returnValue;
    };
  };
}
