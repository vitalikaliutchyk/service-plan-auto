export enum CarColor {
  Green = 'bg-green-400',
  Yellow = 'bg-yellow-300',
  Orange = 'bg-orange-400',
  Red = 'bg-red-400',
  Blue = 'bg-blue-300',
  Gray = 'bg-gray-300',
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  avatar?: string;
}

export interface Booking {
  id: string;
  stationId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  carModel: string;
  vin: string;
  description: string;
  clientName: string;
  clientPhone: string;
  masterId: string; // The user who created it
  color: CarColor;
}

export interface Station {
  id: string;
  name: string;
  type: 'lift' | 'pit' | 'other';
}

export interface BookingFormData {
  stationId: string;
  startTime: string;
  durationMinutes: number;
  carModel: string;
  vin: string;
  description: string;
  clientName: string;
  clientPhone: string;
  color: CarColor;
}