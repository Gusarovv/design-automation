import { serverAPI } from './api';

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type RegisterRequestDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthResponseDto = {
  token: string;
};

export const authAPI = serverAPI.injectEndpoints({
  endpoints: (build) => ({
    // Регистрация в системе
    register: build.mutation<AuthResponseDto, RegisterRequestDto>({
      query: ({ email, password, firstName, lastName }) => ({
        url: '/auth/register',
        method: 'POST',
        body: {
          email,
          password,
          firstName,
          lastName,
        },
      }),
    }),
    // Аутентификация в системе
    login: build.mutation<AuthResponseDto, LoginRequestDto>({
      query: ({ email, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          email,
          password,
        },
      }),
    }),
  }),
});
