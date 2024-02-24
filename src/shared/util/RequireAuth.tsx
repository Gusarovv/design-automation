import { Navigate, Outlet } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks/useAppRedux';
import { setUserIsAuth } from '../store/reducers/UserSlice';

export const RequireAuth = () => {
  const dispatch = useAppDispatch();

  const { isAuth } = useAppSelector((state) => state.userReducer);
  if (isAuth) {
    return <Outlet />;
  }

  const token = localStorage.getItem('token');
  if (token) {
    dispatch(setUserIsAuth(true));
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};
