import { html, render } from 'lit-html';
import { format } from 'date-fns'

const el = document.getElementById('app');

interface hookState {
  deps?: any[];
  value?: any;
} 

const React = (function () {
  let rootEl: HTMLElement;
  let rootComponent;
  let hooks = [] as hookState[];
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
    const deps = hooks[currentHook]?.deps; // type: array | undefined
    const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true;
    if (hasNoDeps || hasChangedDeps) {
      callback();
      hooks[currentHook] = {
        deps: depArray
      };
    }
    currentHook++; // done with this hook
  };

  const useState = (initialValue) => {
    hooks[currentHook] = hooks[currentHook] || {value: initialValue}; // type: any
    const setStateHookIndex = currentHook; // for setState's closure!
    const setState = newState => (hooks[setStateHookIndex] = {value: newState});
    return [hooks[currentHook++]?.value, setState];
  };

  const useMemo = (memo, depArray) => {
    const hasNoDeps = !depArray;
    var hook = hooks[currentHook] ?? {} as hookState; // type: array | undefined
    const hasChangedDeps = hook?.deps ? !depArray.every((el, i) => el === hook?.deps[i]) : true;

    if (hasNoDeps || hasChangedDeps) {
      hook.value = memo()
    }

    hooks[currentHook++] = {
      value: hook.value,
      deps: depArray
    }

    return hook.value;
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
    <div class="h-screen w-100 flex flex-col bg-gray-700 items-center justify-center">
      <div class="rounded bg-gray-100 w-2/3 px-6 py-4 flex flex-col shadow-lg">
        <h1 class="text-3xl">What the Hook?!</h1>  
        <h3 class="text-xl">Count: ${count}</h3>
        <h3 class="text-xl">Double count: ${doubleCount}</h3>
        <button
          @click=${increment}
          class="rounded hover:bg-pink-700 bg-pink-600 p-2 text-white mt-2">
          Increment
        </button>
      </div>
      <span class="text-3xl text-white m-2 fixed right-0 bottom-0">${formatTime(date)}</span>
    </div>
  `;
}

React.mount(el, Component);
