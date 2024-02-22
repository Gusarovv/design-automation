
import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { setGuilds, setUser, setUserProfile } from '@shared/store/reducers/UserSlice';
// import { IRefreshResponse } from '@shared/interface/refresh-response.interface';

const baseQuery = fetchBaseQuery({
   baseUrl: `${import.meta.env.VITE_S_URL}`,
   credentials: 'include',
   prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
         headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
   },
});

const baseQueryWithRefresh = async (args: FetchArgs, api: BaseQueryApi, extraOptions: any) => {
   let result = await baseQuery(args, api, extraOptions);
   if (result?.error?.status === 401) {
      localStorage.removeItem('token');
      const refreshResult = await baseQuery(
         {
            url: '/oauth/refresh',
            method: 'POST',
            body: {
               host: import.meta.env.VITE_OAUTH_REDIRECT,
            },
         },
         api,
         extraOptions,
      );
      const dataRefresh = refreshResult?.data as any;
      // const dataRefresh = refreshResult?.data as IRefreshResponse;
      if (dataRefresh) {
        //  api.dispatch(setUser(dataRefresh.user)); // TODO
        //  api.dispatch(setUserProfile(dataRefresh.userProfile)); // TODO
        //  api.dispatch(setGuilds(dataRefresh.guilds)); // TODO
         localStorage.setItem('token', dataRefresh.accessToken);
         if (args.url === '/oauth/user') {
            result.error = null;
            result.data = dataRefresh.user;
         } else if (args.url === '/oauth/user/guilds') {
            result.error = null;
            result.data = dataRefresh.guilds;
         } else {
            result = await baseQuery(args, api, extraOptions);
         }
      } else {
        //  api.dispatch(setUser(null)); // TODO
        //  api.dispatch(setUserProfile(null)); // TODO
        //  api.dispatch(setGuilds(null)); // TODO
      }
   }
   return result;
};

export const serverAPI = createApi({
   reducerPath: 'serverAPI',
   baseQuery: baseQuery,
  //  baseQuery: baseQueryWithRefresh, // TODO: обновить при реализации 401
   endpoints: () => ({}),
});
