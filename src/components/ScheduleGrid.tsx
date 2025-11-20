import React, { useState, useMemo } from 'react';
import { Booking, Station, BookingFormData, User } from '../types';
import { STATIONS, TIME_SLOTS, START_HOUR, END_HOUR } from '../constants';
import { BookingModal } from './BookingModal';

interface ScheduleGridProps {
  date: string;
  bookings: Booking[];
  currentUser: User;
  onAddBooking: (booking: Omit<Booking, 'id'>) => void;
  onUpdateBooking: (id: string, data: BookingFormData) => void;
  onDeleteBooking: (id: string) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  date,
  bookings,
  currentUser,
  onAddBooking,
  onUpdateBooking,
  onDeleteBooking
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [preselected, setPreselected] = useState<{ stationId: string; time: string } | undefined>(undefined);

  const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
  const SLOT_DURATION = 30;
  const SLOT_HEIGHT_PERCENT = (SLOT_DURATION / TOTAL_MINUTES) * 100;

  const getMinutesFromStart = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h * 60 + m) - (START_HOUR * 60);
  };

  const handleSlotClick = (stationId: string, time: string) => {
    setEditingBooking(null);
    setPreselected({ stationId, time });
    setIsModalOpen(true);
  };

  const handleBookingClick = (e: React.MouseEvent, booking: Booking) => {
    e.stopPropagation();
    setEditingBooking(booking);
    setPreselected(undefined);
    setIsModalOpen(true);
  };

  const handleSave = (data: BookingFormData) => {
    if (editingBooking) {
      onUpdateBooking(editingBooking.id, data);
    } else {
      onAddBooking({
        ...data,
        date,
        masterId: currentUser.id
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    onDeleteBooking(id);
    setIsModalOpen(false);
  };

  const daysBookings = useMemo(() => 
    bookings.filter(b => b.date === date), 
  [bookings, date]);

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="flex bg-white border-b sticky top-0 z-20 shadow-sm flex-shrink-0 h-[40px] md:h-[50px]">
        <div className="w-12 md:w-16 flex-shrink-0 bg-gray-100 border-r p-1 text-center font-bold text-gray-500 flex items-center justify-center text-[10px] md:text-xs">
          Время
        </div>
        <div className="flex flex-1 overflow-hidden">
          {STATIONS.map(station => (
            <div 
              key={station.id} 
              className="flex-1 min-w-[100px] p-1 text-center font-serif font-bold text-xs md:text-base border-r bg-white text-gray-800 flex items-center justify-center leading-none break-words hyphens-auto"
            >
              {station.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative h-full">
        <div className="w-12 md:w-16 flex-shrink-0 bg-gray-50 border-r h-full flex flex-col">
          {TIME_SLOTS.map(time => (
            <div 
              key={time} 
              className="border-b text-[9px] md:text-[10px] text-gray-500 font-medium flex items-center justify-center leading-none"
              style={{ height: `${SLOT_HEIGHT_PERCENT}%`, minHeight: 0 }}
            >
              {time}
            </div>
          ))}
        </div>

        <div className="flex flex-1 relative h-full">
          <div className="absolute inset-0 flex h-full w-full">
             {STATIONS.map(station => (
               <div key={`bg-${station.id}`} className="flex-1 border-r relative h-full flex flex-col min-w-[100px]">
                  {TIME_SLOTS.map(time => (
                    <div 
                      key={`${station.id}-${time}`}
                      className="border-b hover:bg-blue-50 transition-colors cursor-pointer w-full"
                      style={{ height: `${SLOT_HEIGHT_PERCENT}%`, minHeight: 0 }}
                      onClick={() => handleSlotClick(station.id, time)}
                    />
                  ))}
               </div>
             ))}
          </div>

          <div className="absolute inset-0 flex pointer-events-none h-full w-full">
             {STATIONS.map(station => {
                const stationBookings = daysBookings.filter(b => b.stationId === station.id);
                return (
                  <div key={`events-${station.id}`} className="flex-1 relative h-full min-w-[100px]">
                    {stationBookings.map(booking => {
                      const top = (getMinutesFromStart(booking.startTime) / TOTAL_MINUTES) * 100;
                      const height = (booking.durationMinutes / TOTAL_MINUTES) * 100;
                      const isTiny = height < (SLOT_HEIGHT_PERCENT * 1.5);

                      return (
                        <div
                          key={booking.id}
                          className={`absolute inset-x-0.5 rounded border shadow-sm px-1 py-0.5 overflow-hidden cursor-pointer hover:brightness-95 hover:scale-[1.01] hover:z-50 transition-all pointer-events-auto ${booking.color} border-black/10 text-gray-900 group`}
                          style={{
                            top: `${top}%`,
                            height: `${height}%`,
                            zIndex: 10
                          }}
                          onClick={(e) => handleBookingClick(e, booking)}
                          title={`${booking.carModel} - ${booking.description}`}
                        >
                          <div className="flex flex-col h-full text-[8px] md:text-[10px] leading-tight">
                            <div className="flex justify-between items-start font-bold">
                                <span className="truncate mr-1">{booking.carModel}</span>
                            </div>
                            <div className={`opacity-90 whitespace-pre-wrap break-words leading-tight ${isTiny ? 'line-clamp-1' : 'line-clamp-3 md:line-clamp-4'}`}>
                                {booking.description}
                            </div>
                            {!isTiny && (
                                <div className="mt-auto pt-0.5 border-t border-black/10 flex justify-between items-end">
                                    <div className="font-semibold truncate max-w-[70%]">{booking.clientName}</div>
                                    <div className="opacity-75 truncate">{booking.clientPhone}</div>
                                </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
             })}
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={editingBooking ? () => handleDelete(editingBooking.id) : undefined}
        initialData={editingBooking}
        preselectedSlot={preselected}
      />
    </div>
  );
};