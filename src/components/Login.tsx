import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name || !username || !password) {
          throw new Error('Пожалуйста, заполните все поля');
        }
        if (password.length < 6) {
          throw new Error('Пароль должен быть не менее 6 символов');
        }
        await authService.register(name, username, password);
      } else {
        if (!username || !password) {
          throw new Error('Введите логин и пароль');
        }
        await authService.login(username, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/weak-password') setError('Пароль слишком простой (минимум 6 символов)');
      else if (err.code === 'auth/email-already-in-use') setError('Пользователь с таким логином уже существует');
      else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') setError('Неверный логин или пароль');
      else setError(err.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-1 text-slate-800">ServicePlanAuto v.1.0</h1>
        <p className="text-center text-slate-500 mb-6 text-sm">Планирование (Cloud)</p>

        <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => { setIsRegistering(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isRegistering ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Вход
          </button>
          <button
            onClick={() => { setIsRegistering(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isRegistering ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Регистрация
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Имя мастера</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Иван Иванов"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Логин</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              placeholder="ivan"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••"
            />
          </div>

          {error && (
            <div className="p-2 bg-red-50 text-red-600 text-xs rounded text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Загрузка...' : (isRegistering ? 'Зарегистрироваться' : 'Войти в систему')}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-gray-400">
            {isRegistering 
              ? 'Придумайте логин и пароль (мин. 6 символов)' 
              : 'Введите свои данные для входа'}
          </p>
        </div>
      </div>
    </div>
  );
};