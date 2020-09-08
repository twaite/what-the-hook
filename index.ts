import { html, render } from 'lit-html';
import { format } from 'date-fns'

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
    var [value, deps] = hooks[currentHook] ?? []; // type: array | undefined
    const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true;

    if (hasNoDeps || hasChangedDeps) {
      value = memo()
    }

    hooks[currentHook++] = [value, depArray]

    return value;
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
  var [date, setDate] = React.useState(new Date());

  React.useEffect(() => {
    console.log('hello this is an effect')
  }, []);

  React.useEffect(() => {
    var timeout = setTimeout(() => {
      setDate(new Date());
      React.render();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [date, setDate])

  const doubleCount = React.useMemo(() => {
    console.log('calculating doubleCount');
    return count * 2;
  }, [count])

  const increment = () => {
    setCount(count + 1);
    React.render();
  }

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm:ss a')
  }

  return html`
    <div class="flex flex-col bg-gray-700 items-center justify-center rounded py-5">
      <div class="rounded bg-gray-100 w-1/3 px-6 py-4 flex flex-col shadow-lg">
        <div class="text-3xl text-gray-800">What the Hook?!</div>  
        <div class="text-base text-gray-800">Count: ${count}</div>
        <div class="text-base text-gray-800">Double count: ${doubleCount}</div>
        <div
          @click=${increment}
          class="rounded hover:bg-pink-700 bg-pink-600 p-2 text-white text-sm mt-2 cursor-pointer">
          Increment
        </div>
      </div>
      <span class="text-3xl text-white my-5 mx-2 fixed right-0 bottom-0">${formatTime(date)}</span>
    </div>
  `;
}

React.mount(el, Component);
