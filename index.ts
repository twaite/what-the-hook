import { html, render } from 'lit-html';

const el = document.getElementById('app');

const React = (function () {
  let rootEl: HTMLElement;
  let rootComponent;
  let hooks = [];
  let currentHook = 0;

  const reactRender = () => {
    render(rootComponent(), el);
    currentHook = 0;
  }

  const mount = (el: HTMLElement, Component) => {
    rootEl = el;
    rootComponent = Component;
    reactRender();
  };

  const useEffect = (callback, depArray) => {
    const hasNoDeps = !depArray;
    const deps = hooks[currentHook]; // type: array | undefined
    const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true;
    if (hasNoDeps || hasChangedDeps) {
      callback();
      hooks[currentHook] = depArray;
    }
    currentHook++; // done with this hook
  };

  const useState = (initialValue) => {
    hooks[currentHook] = hooks[currentHook] || initialValue; // type: any
    const setStateHookIndex = currentHook; // for setState's closure!
    const setState = newState => (hooks[setStateHookIndex] = newState);
    return [hooks[currentHook++], setState];
  };

  const useMemo = (memo, depArray) => {
    const hasNoDeps = !depArray;
    const deps = hooks[currentHook]; // type: array | undefined
    const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true;

    if (hasNoDeps || hasChangedDeps) {
      return memo();
    }
  }

  return {
    mount,
    render: reactRender,
    useEffect,
    useMemo,
    useState,
  }
})();

const Component = () => {
  var [count, setCount] = React.useState(0);

  React.useEffect(() => {
    console.log('hello this is an effect')
  }, []);

  const doubleCount = React.useMemo(() => {
    return count * 2;
  }, [count])

  const increment = () => {
    console.log('incrementing: ', count);
    setCount(count + 1);
    React.render();
  }

  return html`
    <h1>Hello World</h1>  
    <h3>Count: ${count}</h3>
    <h3>Double count: ${doubleCount}</h3>
    <button @click=${increment}>Increment</button>
  `;
}

React.mount(el, Component);