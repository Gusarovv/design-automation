import { BaseQueryApi, FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUserIsAuth } from '../store/reducers/UserSlice';

import JSONbig from 'json-bigint';

const JSONbigString = JSONbig({ storeAsString: true });

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
  fetchFn: async (url, config) => {
    const response = await fetch(url, config);
    if (!response.ok) {
      // Если ответ не окей, возвращаем его как есть, чтобы RTK Query мог обработать ошибку
      return response;
    }
    const text = await response.text();
    const data = text.length ? JSONbigString.parse(text) : undefined;
    // Создаем новый объект Response с преобразованными данными
    return new Response(JSON.stringify(data), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
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
