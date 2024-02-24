import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { FiAlertTriangle } from 'react-icons/fi';
import { RiLockPasswordLine } from 'react-icons/ri';

import { authAPI } from '../shared/api/auth';
import { useAppDispatch, useAppSelector } from '../shared/hooks/useAppRedux';
import { setUserIsAuth } from '../shared/store/reducers/UserSlice';

export const AuthPage = () => {
  const dispatch = useAppDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('test');
  const [firstName, setFirstName] = useState('tes');
  const [lastName, setLastName] = useState('test');

  // Валидация email
  const [emailError, setEmailError] = useState('');
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-z0-9]+@[a-z0-9]+\.[a-z]+$/;
    return emailPattern.test(email);
  };

  // Обработчик изменения поля email
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    if (validateEmail(emailValue)) {
      setEmailError('');
    } else {
      setEmailError('Invalid email address.');
    }
  };

  const [register] = authAPI.useRegisterMutation();
  const [login] = authAPI.useLoginMutation();
  const [error, setError] = useState(''); // Общее сообщение об ошибке
  const [errorApi, setApiError] = useState(''); // Общее сообщение об ошибке
  const [success, setSuccess] = useState(''); // Сообщение об успехе
  const auth = async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    setError(''); // Очистка предыдущих ошибок

    // Проверяем, что все поля заполнены
    if (!email || !password || (!isLogin && (!firstName || !lastName))) {
      setError('Please fill in all fields!');
      return;
    }

    // Проверяем валидность email
    if (!validateEmail(email)) {
      setError('Invalid email address!');
      return;
    }

    // Выполняем запрос к API
    try {
      if (isLogin) {
        await login({ email, password })
          .unwrap()
          .then((data) => {
            // Сохраняем токен в localStorage и в store `true`
            localStorage.setItem('token', data.token);
            dispatch(setUserIsAuth(true));
          });
        setSuccess('Successfully logged in!');
      } else {
        await register({ email, password, firstName, lastName }).unwrap();
        setSuccess('Registration successful!');
        setIsLogin(true);
      }
    } catch (error) {
      setApiError((error as any).data?.message || (error as any).data?.detail || 'An error occurred.');
    }
  };

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

  const formVariants = {
    hidden: {
      opacity: 0,
      x: 40,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: -40,
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <motion.div
        className="max-w-md w-full space-y-8 p-10 bg-white bg-opacity-90 shadow-xl rounded-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ backdropFilter: 'blur(10px)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {isLogin ? 'Sign in to your account' : 'Register an account'}
              </h2>
            </div>
            <div className="mt-8 space-y-6">
              {/* Email */}
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`appearance-none w-full px-10 py-2 border ${
                        emailError ? 'border-red-500' : 'border-transparent'
                      } placeholder-gray-500 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent`}
                      placeholder="Email address"
                      onChange={handleEmailChange}
                      value={email}
                    />
                  </div>
                  {/* Отображаем сообщение об ошибке по центру */}
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1 align-middle text-center pb-1">{emailError}</p>
                  )}
                </div>
                {/* Password */}
                <div className="mt-4">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none w-full px-10 py-2 border border-transparent placeholder-gray-500 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </div>
                </div>
              </div>
              {/* FirstName */}
              {!isLogin && (
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="first-name" className="sr-only">
                      First name
                    </label>
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      required
                      className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent"
                      placeholder="First name"
                      onChange={(e) => setFirstName(e.target.value)}
                      value={firstName}
                    />
                  </div>
                  {/* LastName */}
                  <div className="mt-4">
                    <label htmlFor="last-name" className="sr-only">
                      Last name
                    </label>
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      required
                      className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent"
                      placeholder="Last name"
                      onChange={(e) => setLastName(e.target.value)}
                      value={lastName}
                    />
                  </div>
                </div>
              )}
              {/* Submit */}
              <div>
                <button
                  onClick={auth}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-0"
                >
                  {isLogin ? 'Sign in' : 'Register'}
                </button>
                <p className="text-sm text-red-700 pt-1 text-center">{error}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-indigo-600 hover:text-indigo-500 text-sm font-semibold"
            onClick={toggleForm}
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}
          </button>
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
    </div>
  );
};
