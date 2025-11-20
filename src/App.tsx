import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { ScheduleGrid } from './components/ScheduleGrid';
import { Header } from './components/Header';
import { User, Booking, BookingFormData } from './types';
import { authService } from './services/authService';
import { db } from './services/firebase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Listen to Authentication State
  useEffect(() => {
    const unsubscribeAuth = authService.subscribe((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Listen to Database Changes (Firestore Compat)
  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }
    
    // Subscribe to the 'bookings' collection using compat API
    const unsubscribeSnapshot = db.collection('bookings').onSnapshot((snapshot: any) => {
      const loadedBookings: Booking[] = [];
      snapshot.forEach((doc: any) => {
        loadedBookings.push(doc.data() as Booking);
      });
      setBookings(loadedBookings);
    }, (error: any) => {
      console.error("Error fetching bookings:", error);
    });

    return () => unsubscribeSnapshot();
  }, [user]);

  const handleLogout = () => {
    authService.logout();
  };

  const handleAddBooking = async (newBookingData: Omit<Booking, 'id'>) => {
    try {
      // Use Firestore compat to generate ID and set data
      const newBookingRef = db.collection('bookings').doc();
      const newBooking: Booking = {
        ...newBookingData,
        id: newBookingRef.id,
      };
      // Write to cloud
      await newBookingRef.set(newBooking);
    } catch (e) {
      console.error("Error adding booking: ", e);
      alert("Ошибка при сохранении. Проверьте интернет.");
    }
  };

  const handleUpdateBooking = async (id: string, data: BookingFormData) => {
    try {
      await db.collection('bookings').doc(id).update({ ...data });
    } catch (e) {
       console.error("Error updating booking: ", e);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await db.collection('bookings').doc(id).delete();
    } catch (e) {
       console.error("Error deleting booking: ", e);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Загрузка системы...</div>;
  }

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header 
        currentUser={user} 
        currentDate={date} 
        onDateChange={setDate}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-hidden relative h-full">
        <ScheduleGrid 
          date={date}
          bookings={bookings}
          currentUser={user}
          onAddBooking={handleAddBooking}
          onUpdateBooking={handleUpdateBooking}
          onDeleteBooking={handleDeleteBooking}
        />
      </main>
    </div>
  );
};

export default App;