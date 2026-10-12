// Ensure window.fetch is writable and has setter across prototype chain to prevent 'only a getter' errors
if (typeof window !== 'undefined') {
  try {
    const currentFetch = window.fetch || (typeof globalThis !== 'undefined' ? globalThis.fetch : null);
    if (currentFetch) {
      let proto: any = window;
      while (proto) {
        try {
          const desc = Object.getOwnPropertyDescriptor(proto, 'fetch');
          if (desc) {
            Object.defineProperty(proto, 'fetch', {
              get: () => currentFetch,
              set: (fn) => {
                try {
                  (window as any)._customFetch = fn;
                } catch {
                  // ignore
                }
              },
              configurable: true,
              enumerable: true,
            });
          }
        } catch {
          // ignore
        }
        proto = Object.getPrototypeOf(proto);
      }

      try {
        Object.defineProperty(window, 'fetch', {
          get: () => (window as any)._customFetch || currentFetch,
          set: (fn) => {
            (window as any)._customFetch = fn;
          },
          configurable: true,
          enumerable: true,
        });
      } catch {
        // ignore
      }
    }
  } catch {
    // Ignore if not configurable
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'katex/dist/katex.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
