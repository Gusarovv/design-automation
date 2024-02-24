import { Navigate, Outlet } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks/useAppRedux';
import { setUserIsAuth } from '../store/reducers/UserSlice';

export const OnlyAuth = () => {
  const dispatch = useAppDispatch();

  const { isAuth } = useAppSelector((state) => state.userReducer);
  const token = localStorage.getItem('token');
  if (!isAuth && !token) {
    return <Outlet />;
  }

  dispatch(setUserIsAuth(true));
  return <Navigate to="/chat" replace />;
};
