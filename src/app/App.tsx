import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { LayoutMain } from '../layout/LayoutMain';
import { AuthPage } from '../pages/AuthPage';
import { ChatPage } from '../pages/ChatPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OnlyAuth } from '../shared/util/OnlyAuth';
import { RequireAuth } from '../shared/util/RequireAuth';
import ScrollToTop from '../shared/util/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<LayoutMain />}>
            <Route element={<OnlyAuth />}>
              <Route index element={<AuthPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />

          {/* protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="/chat" element={<LayoutMain />}>
              <Route index element={<ChatPage />} />
            </Route>
          </Route>
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
