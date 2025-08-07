import type { Animal, Kpi, ReproductiveEvent } from '@/lib/types';
import { Users, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { addDays, subMonths } from 'date-fns';

export const kpis: Kpi[] = [
  {
    title: 'Total de Animales',
    value: '342',
    change: '+5 desde el mes pasado',
    icon: Users,
  },
  {
    title: 'Tasa de Natalidad (12m)',
    value: '88%',
    change: '+2%',
    icon: TrendingUp,
  },
  {
    title: 'Tasa de Mortalidad (12m)',
    value: '2.1%',
    change: '-0.5%',
    icon: TrendingDown,
  },
  {
    title: 'Animales que Necesitan Atención',
    value: '12',
    icon: AlertCircle,
  },
];

export const animals: Animal[] = [
  { id: '101', name: 'Daisy', breed: 'Holstein', sex: 'Hembra', birthDate: '2021-05-15', fatherId: 'B01', motherId: 'C02', weight: 650, photoUrl: 'https://placehold.co/400x300.png', status: 'Activo', category: 'Vaca' },
  { id: '102', name: 'Bessie', breed: 'Angus', sex: 'Hembra', birthDate: '2022-01-20', fatherId: 'B03', motherId: 'C04', weight: 580, photoUrl: 'https://placehold.co/400x300.png', status: 'Activo', category: 'Novilla' },
  { id: '103', name: 'Ferdinand', breed: 'Hereford', sex: 'Macho', birthDate: '2020-11-10', fatherId: null, motherId: 'C05', weight: 900, photoUrl: 'https://placehold.co/400x300.png', status: 'Activo', category: 'Toro' },
  { id: '104', name: 'Annabelle', breed: 'Jersey', sex: 'Hembra', birthDate: '2023-03-01', fatherId: 'B01', motherId: '101', weight: 150, photoUrl: 'https://placehold.co/400x300.png', status: 'Activo', category: 'Ternero' },
  { id: '105', name: 'Angus Jr.', breed: 'Angus', sex: 'Macho', birthDate: '2023-02-14', fatherId: 'B03', motherId: '102', weight: 180, photoUrl: 'https://placehold.co/400x300.png', status: 'Activo', category: 'Ternero' },
  { id: '106', name: 'Brutus', breed: 'Brahman', sex: 'Macho', birthDate: '2021-08-22', fatherId: null, motherId: null, weight: 820, photoUrl: 'https://placehold.co/400x300.png', status: 'Activo', category: 'Novillo' },
];

export const herdEvolutionData = [
  { date: subMonths(new Date(), 12).toISOString().substring(0, 7), count: 280 },
  { date: subMonths(new Date(), 11).toISOString().substring(0, 7), count: 285 },
  { date: subMonths(new Date(), 10).toISOString().substring(0, 7), count: 290 },
  { date: subMonths(new Date(), 9).toISOString().substring(0, 7), count: 300 },
  { date: subMonths(new Date(), 8).toISOString().substring(0, 7), count: 305 },
  { date: subMonths(new Date(), 7).toISOString().substring(0, 7), count: 310 },
  { date: subMonths(new Date(), 6).toISOString().substring(0, 7), count: 315 },
  { date: subMonths(new Date(), 5).toISOString().substring(0, 7), count: 320 },
  { date: subMonths(new Date(), 4).toISOString().substring(0, 7), count: 328 },
  { date: subMonths(new Date(), 3).toISOString().substring(0, 7), count: 335 },
  { date: subMonths(new Date(), 2).toISOString().substring(0, 7), count: 338 },
  { date: subMonths(new Date(), 1).toISOString().substring(0, 7), count: 342 },
];

export const herdDistributionData = [
    { category: 'Terneros', count: 45, fill: 'hsl(var(--chart-1))' },
    { category: 'Novillas', count: 88, fill: 'hsl(var(--chart-2))' },
    { category: 'Vacas', count: 150, fill: 'hsl(var(--chart-3))' },
    { category: 'Novillos', count: 39, fill: 'hsl(var(--chart-4))' },
    { category: 'Toros', count: 20, fill: 'hsl(var(--chart-5))' },
];

const today = new Date();
export const reproductiveEvents: ReproductiveEvent[] = [
  { id: 'e1', animalName: 'Daisy', animalId: '101', eventType: 'Celo', date: addDays(today, 2) },
  { id: 'e2', animalName: 'Bessie', animalId: '102', eventType: 'Chequeo Preñez', date: addDays(today, 5) },
  { id: 'e3', animalName: 'Clara', animalId: '107', eventType: 'Fecha de Parto', date: addDays(today, 10) },
  { id: 'e4', animalName: 'Bella', animalId: '108', eventType: 'Celo', date: addDays(today, 12) },
];
