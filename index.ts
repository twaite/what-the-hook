const el = document.getElementById('app');

const React = (function () {
  const hooks = [];

  // Tracks the current hook
  let currentHook = 0;

  return {
    render(Component, rootEl: Element) {
      const Comp = Component();
      const html = Comp.render();
      currentHook = 0;
      rootEl.innerHTML = html;

      return Comp;
    },

    useEffect(callback, depArray) {
      const hasNoDeps = !depArray;
      const deps = hooks[currentHook];
      const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true;

      if (hasNoDeps || hasChangedDeps) {
        callback();
        hooks[currentHook] = depArray;
      }

      currentHook++;
    },

    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue;
      const setStateHookIndex = currentHook;
      const setState = newState => (hooks[setStateHookIndex] = newState)
      return [hooks[currentHook++], setState]
    }
  };
})();

function Counter() {
  const [count, setCount] = React.useState(0);
  const [text, setText] = React.useState('foo');

  React.useEffect(() => {
    console.log('effect', count, text)
  }, [count, text])

  return {
    click: () => setCount(count + 1),
    type: txt => setText(txt),
    noop: () => setCount(count),
    render: () => `
      <h1>Count: ${count}</h1>
    `
  }
}

let App;

App = React.render(Counter, el);