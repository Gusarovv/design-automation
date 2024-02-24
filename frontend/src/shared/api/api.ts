import { BaseQueryApi, FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUserIsAuth } from '../store/reducers/UserSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_S_URL}`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return headers;
  },
});

const baseQueryWithRefresh = async (args: FetchArgs, api: BaseQueryApi, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    localStorage.removeItem('token');
    api.dispatch(setUserIsAuth(false))
  }
  return result;
};

export const serverAPI = createApi({
  reducerPath: 'serverAPI',
  baseQuery: baseQueryWithRefresh,
  endpoints: () => ({}),
});
