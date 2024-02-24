import { serverAPI } from './api';

export type MessageDto = {
  id: number;
  author: string;
  message: string;
  view: number;
};

export type ViewDto = {
  view: number;
};

export type MessageRequestDto = {
  author?: string;
  message: string;
};

export const messagesAPI = serverAPI.injectEndpoints({
  endpoints: (build) => ({
    // Получение списка всех сообщений
    getMessages: build.query<MessageDto[], void>({
      query: () => ({
        url: '/messages',
      }),
    }),
    // Получение сообщения по ID
    getMessage: build.query<MessageDto, number>({
      query: (id: number) => ({
        url: `/messages/${id}`,
      }),
    }),
    // Создание и отправка нового сообщения
    sendMessage: build.mutation<MessageDto, MessageRequestDto>({
      query: (dto) => ({
        url: `/messages`,
        method: 'POST',
        body: dto,
      }),
    }),
    // Увеличение счетчика просмотров сообщения
    viewMessage: build.mutation<ViewDto, number>({
      query: (id) => ({
        url: `/messages/${id}/view`,
        method: 'POST',
      }),
    }),
  }),
});
