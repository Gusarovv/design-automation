import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BsBoxArrowRight } from 'react-icons/bs';
import { FiAlertTriangle, FiMessageSquare, FiSearch } from 'react-icons/fi';
import { IoMdSend } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

import { Dialog } from '@headlessui/react';

import { MessageDto, messagesAPI } from '../shared/api/messages';
import { useAppDispatch } from '../shared/hooks/useAppRedux';
import { setUserIsAuth } from '../shared/store/reducers/UserSlice';
import { Loading } from '../shared/util/Loading';

const MessageCard = ({ message }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewCount, setViewCount] = useState(message.view);

  const [viewMessage] = messagesAPI.useViewMessageMutation();

  const openModal = () => {
    viewMessage(message.id);
    setViewCount((prev) => prev + 1);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <motion.div
        className="flex justify-between items-center p-4 bg-gray-100 rounded-md mb-2 cursor-pointer hover:bg-gray-200"
        onClick={openModal}
        layout
      >
        <div>
          <h4 className="text-lg font-semibold">{message.author}</h4>
          <p className="text-gray-700">{message.message.substring(0, 100)}...</p>
        </div>
        <span className="text-sm text-gray-500">{viewCount} views</span>
      </motion.div>

      {/* Модальное окно для полного сообщения */}
      <AnimatePresence>
        {isOpen && (
          <Dialog
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            open={isOpen}
            onClose={closeModal}
            className="fixed inset-0 z-10 overflow-y-auto"
          >
            <div className="min-h-screen px-4 text-center">
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

              {/* Этот элемент используется для центрирования модального окна вертикально. */}
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>

              <motion.div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                {/* Иконка "X" для закрытия */}
                <div className="absolute top-3 right-3">
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                    <IoClose className="h-6 w-6" />
                  </button>
                </div>

                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {message.author}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message.message}</p>
                </div>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export const ChatPage = () => {
  const dispatch = useAppDispatch();
  const { data: allMessages, isLoading, isFetching } = messagesAPI.useGetMessagesQuery();
  const [searchMessageId, setSearchMessageId] = useState<number>();
  const [sendMessage] = messagesAPI.useSendMessageMutation();
  const [getMessageById] = messagesAPI.useLazyGetMessageQuery();
  const [message, setMessage] = useState('');
  const [errorApi, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const clearAlerts = () => {
      setApiError('');
      setSuccess('');
    };

    if (errorApi || success) {
      const timer = setTimeout(() => {
        clearAlerts();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorApi, success]);

  const searchMessageById = async () => {
    if (!searchMessageId) {
      setApiError('Please specify message id');
      return;
    }
    let messageBySearch: MessageDto;
    await getMessageById(searchMessageId)
      .then((data) => (messageBySearch = data.data))
      .catch((error) => {
        setApiError((error as any).data?.message || (error as any).data?.detail || 'Message not found.');
      });
    if (messageBySearch) {
      if (allMessages?.find((m) => m.id === searchMessageId)) {
        setApiError('Message already exists in the list.');
      } else {
        dispatch(messagesAPI.util.updateQueryData('getMessages', undefined, (data) => [...data, messageBySearch]));
        setSuccess(`Message found: ${messageBySearch.message}`);
      }
    }
  };

  const sendNewMessage = async () => {
    try {
      let newMessageData: MessageDto;
      await sendMessage({ message })
        .unwrap()
        .then((data: MessageDto) => (newMessageData = data));
      setSuccess('Message sent successfully!');
      setMessage('');
      dispatch(messagesAPI.util.updateQueryData('getMessages', undefined, (data) => [...data, newMessageData]));
    } catch (error) {
      setApiError((error as any).data?.message || (error as any).data?.detail || 'An error occurred.');
    }
  };

  const logout = () => {
    dispatch(setUserIsAuth(false));
  };

  return !isLoading && !isFetching ? (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-3xl p-5 bg-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FiMessageSquare className="text-xl text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Chat Room</h1>
            </div>
            <button className="text-gray-900 hover:text-red-600 text-xl" onClick={logout}>
              <BsBoxArrowRight />
            </button>
          </div>

          {/* Поле поиска сообщения по ID */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-200"
              placeholder="Search message by ID..."
              value={searchMessageId || ''}
              onChange={(e) => setSearchMessageId(Number(e.target.value.replace(/\D/g, '')) || undefined)}
            />
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-r-md"
              onClick={searchMessageById}
            >
              <FiSearch />
            </button>
          </div>

          {/* Список сообщений */}
          {allMessages && (
            <motion.div className="custom-scrollbar h-96 mb-4 overflow-y-auto" layout>
              {allMessages
                .filter((m) => m.id.toString().includes(searchMessageId?.toString() ?? ''))
                .map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))}
            </motion.div>
          )}

          {/* Форма отправки нового сообщения */}
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-200"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendNewMessage()}
            />
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-r-md" onClick={sendNewMessage}>
              <IoMdSend />
            </button>
          </div>
        </div>
      </motion.div>
      {/* Алерты с сообщениями об ошибке или успехе */}
      <AnimatePresence>
        {(errorApi || success) && (
          <motion.div
            className={`fixed top-5 transform -translate-y-1/2 px-6 py-4 rounded-md shadow-lg ${
              errorApi ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
            initial={{ x: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ x: 10, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <FiAlertTriangle className="text-xl" />
              <p className="text-sm">{errorApi || success}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  ) : (
    <Loading />
  );
};
