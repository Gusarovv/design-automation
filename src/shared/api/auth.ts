// import { IGuildInfo } from '@shared/interface/guild-info.interface';
// import { ILoginResponse } from '@shared/interface/login-response.interface';
// import { ILogoutResponse } from '@shared/interface/logout-response.interface';
// import { IProfileUser, IUserDiscordInfo } from '@shared/interface/user-info.interface';
// import { serverAPI } from './api';

// export const authAPI = serverAPI.injectEndpoints({
//    endpoints: (build) => ({
//       // Авторизация
//       login: build.mutation<ILoginResponse, string>({
//          query: (code) => ({
//             url: '/oauth/login',
//             method: 'POST',
//             body: {
//                code,
//                redirectUri: import.meta.env.VITE_OAUTH_REDIRECT,
//             },
//          }),
//       }),
//       logout: build.mutation<ILogoutResponse, void>({
//          query: () => ({
//             url: '/oauth/logout',
//             method: 'POST',
//             body: {
//                host: import.meta.env.VITE_OAUTH_REDIRECT,
//             },
//          }),
//       }),
//       // Повторный запрос данных авторизации
//       user: build.query<{ user: IUserDiscordInfo; userProfile: IProfileUser }, void>({
//          query: () => ({
//             url: '/oauth/user',
//          }),
//       }),
//       guilds: build.query<IGuildInfo[], void>({
//          query: () => ({
//             url: '/oauth/user/guilds',
//          }),
//       }),
//    }),
// });
