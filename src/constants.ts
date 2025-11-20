import { Station, CarColor } from './types';

export const STATIONS: Station[] = [
  { id: 'lift-1', name: 'Подъемник 1', type: 'lift' },
  { id: 'lift-2', name: 'Подъемник 2', type: 'lift' },
  { id: 'lift-3', name: 'Подъемник 3', type: 'lift' },
  { id: 'lift-4', name: 'Подъемник 4', type: 'lift' },
  { id: 'pit-1', name: 'Яма 1 (Электрик)', type: 'pit' },
  { id: 'pit-2', name: 'Яма 2', type: 'pit' },
  { id: 'wash', name: 'Мойка / Развал', type: 'other' },
];

export const START_HOUR = 8;
export const END_HOUR = 19; // Ends at 19:00
export const SLOT_DURATION = 30; // minutes

// Helper to generate time slots
export const TIME_SLOTS: string[] = [];
for (let h = START_HOUR; h <= 19; h++) {
  TIME_SLOTS.push(`${h.toString().padStart(2, '0')}:00`);
  if (h < 19) {
    TIME_SLOTS.push(`${h.toString().padStart(2, '0')}:30`);
  }
}

export const COLORS_OPTIONS = [
  { label: 'Зеленый (Готово/Ок)', value: CarColor.Green },
  { label: 'Желтый (В работе)', value: CarColor.Yellow },
  { label: 'Оранжевый (Ожидание)', value: CarColor.Orange },
  { label: 'Красный (Проблема)', value: CarColor.Red },
  { label: 'Синий (Запись)', value: CarColor.Blue },
];