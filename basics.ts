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

  const useEffect = () => {};
  const useState = () => {};
  const useMemo = () => {}

  return {
    mount,
    render: reactRender,
    useEffect,
    useMemo,
    useState,
  }
})();

const Component = () => {

  const log = () => {
    console.log('hello world');
  }

  return html`
    <div class="bg-white p-4 rounded">
      <h1>My Component</h1>
      <button @click=${log} class="bg-pink-700 text-white rounded py-2 px-3">Log</button>
    </div>
  `;
}

React.mount(el, Component);
