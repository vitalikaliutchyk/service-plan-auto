import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  currentDate: string;
  onDateChange: (date: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, currentDate, onDateChange, onLogout }) => {
  
  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    onDateChange(new Date().toISOString().split('T')[0]);
  };

  const displayDate = new Date(currentDate).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm z-30 relative">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
             {currentUser.avatar}
           </div>
           <div>
             <div className="text-sm font-bold leading-none">{currentUser.name}</div>
             <div className="text-xs text-gray-500">Мастер</div>
           </div>
        </div>
        <button onClick={onLogout} className="text-xs text-red-500 hover:underline">Выйти</button>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handlePrevDay} className="p-1 hover:bg-gray-100 rounded-full">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <div className="text-center min-w-[200px]">
          <h1 className="text-lg font-bold text-gray-800 capitalize">{displayDate}</h1>
        </div>

        <button onClick={handleNextDay} className="p-1 hover:bg-gray-100 rounded-full">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
        
        <button onClick={handleToday} className="text-sm text-primary font-medium hover:underline ml-2">
          Сегодня
        </button>
      </div>

      <div className="w-32 text-right">
        <span className="text-xs text-gray-400">ServicePlanAuto v.1.0 (Cloud)</span>
      </div>
    </header>
  );
};