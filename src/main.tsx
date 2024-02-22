import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@material-tailwind/react';

import App from './app/App.tsx';
import './app/style/global.css';
import { store } from './shared/store/store.ts';
import { ErrorBoundary } from './shared/util/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // TODO: test
  <ErrorBoundary>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>,
);
