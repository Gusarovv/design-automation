import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './app/App.tsx';
import './app/style/global.css';
import { store } from './shared/store/store.ts';
import { ErrorBoundary } from './shared/util/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>,
);
