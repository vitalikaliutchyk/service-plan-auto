import React, { useState, useEffect } from 'react';
import { Booking, BookingFormData, CarColor, Station } from '../types';
import { STATIONS, COLORS_OPTIONS, TIME_SLOTS } from '../constants';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BookingFormData) => void;
  onDelete?: () => void;
  initialData?: Booking | null;
  preselectedSlot?: { stationId: string; time: string };
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  preselectedSlot
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    stationId: STATIONS[0].id,
    startTime: '09:00',
    durationMinutes: 60,
    carModel: '',
    vin: '',
    description: '',
    clientName: '',
    clientPhone: '',
    color: CarColor.Green
  });

  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          stationId: initialData.stationId,
          startTime: initialData.startTime,
          durationMinutes: initialData.durationMinutes,
          carModel: initialData.carModel,
          vin: initialData.vin,
          description: initialData.description,
          clientName: initialData.clientName,
          clientPhone: initialData.clientPhone,
          color: initialData.color,
        });
      } else if (preselectedSlot) {
        setFormData(prev => ({
          ...prev,
          stationId: preselectedSlot.stationId,
          startTime: preselectedSlot.time,
          carModel: '', vin: '', description: '', clientName: '', clientPhone: ''
        }));
      }
      setDeleteConfirm(false);
    }
  }, [isOpen, initialData, preselectedSlot]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (deleteConfirm) {
      if (onDelete) onDelete();
    } else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full border border-gray-300 rounded p-2 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-colors focus:bg-white placeholder-gray-400";

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Редактировать запись' : 'Новая запись'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-1">Время и Место</h3>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Пост</label>
                <select 
                  value={formData.stationId}
                  onChange={(e) => setFormData({...formData, stationId: e.target.value})}
                  className={inputClass}
                >
                  {STATIONS.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Время начала</label>
                  <select 
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className={inputClass}
                  >
                    {TIME_SLOTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Длительность (мин)</label>
                  <select 
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({...formData, durationMinutes: parseInt(e.target.value)})}
                    className={inputClass}
                  >
                    {[30, 60, 90, 120, 150, 180, 240, 300, 360, 480].map(m => (
                      <option key={m} value={m}>{m / 60} ч. ({m} мин)</option>
                    ))}
                  </select>
                </div>
              </div>
               <div>
                <label className="block text-xs text-gray-500 mb-1">Статус (Цвет)</label>
                <div className="grid grid-cols-5 gap-2">
                    {COLORS_OPTIONS.map((c) => (
                        <button
                            key={c.value}
                            type="button"
                            onClick={() => setFormData({...formData, color: c.value as CarColor})}
                            className={`h-8 w-full rounded-md border-2 ${formData.color === c.value ? 'border-black' : 'border-transparent'} ${c.value}`}
                            title={c.label}
                        />
                    ))}
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{COLORS_OPTIONS.find(c => c.value === formData.color)?.label}</p>
              </div>
            </div>
            <div className="space-y-4">
               <h3 className="font-semibold text-gray-700 border-b pb-1">Автомобиль и Клиент</h3>
               <div>
                  <label className="block text-xs text-gray-500 mb-1">Автомобиль</label>
                  <input 
                    type="text"
                    value={formData.carModel}
                    onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                    className={inputClass}
                    placeholder="Geely Emgrand"
                  />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 mb-1">VIN / Госномер</label>
                  <input 
                    type="text"
                    value={formData.vin}
                    onChange={(e) => setFormData({...formData, vin: e.target.value})}
                    className={`${inputClass} font-mono text-sm`}
                    placeholder="XXXXXXX"
                  />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 mb-1">Клиент</label>
                  <input 
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    className={inputClass}
                    placeholder="Имя"
                  />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 mb-1">Телефон</label>
                  <input 
                    type="text"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                    className={inputClass}
                    placeholder="+375..."
                  />
               </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Описание работ / Проблема</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`${inputClass} h-24 resize-none`}
              placeholder="ТО-2, стук в подвеске..."
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between shrink-0 rounded-b-xl z-10">
            {initialData && onDelete ? (
                 <button 
                 type="button"
                 onClick={handleDeleteClick}
                 className={`font-medium px-4 py-2 border rounded transition-all ${deleteConfirm ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-lg scale-105' : 'text-red-500 border-red-100 hover:bg-red-50'}`}
               >
                 {deleteConfirm ? 'Подтвердить удаление?' : 'Удалить'}
               </button>
            ) : <div></div>}
         
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded border bg-white text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button 
              onClick={() => onSave(formData)}
              className="px-6 py-2 rounded bg-primary text-white font-medium hover:bg-blue-800 shadow-md"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};