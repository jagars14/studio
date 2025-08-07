import type { Animal, Kpi, ReproductiveEvent } from '@/lib/types';
import { Users, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { addDays, subMonths } from 'date-fns';

export const kpis: Kpi[] = [
  {
    title: 'Total Animals',
    value: '342',
    change: '+5 since last month',
    icon: Users,
  },
  {
    title: 'Birth Rate (12m)',
    value: '88%',
    change: '+2%',
    icon: TrendingUp,
  },
  {
    title: 'Mortality Rate (12m)',
    value: '2.1%',
    change: '-0.5%',
    icon: TrendingDown,
  },
  {
    title: 'Animals Needing Attention',
    value: '12',
    icon: AlertCircle,
  },
];

export const animals: Animal[] = [
  { id: '101', name: 'Daisy', breed: 'Holstein', sex: 'Female', birthDate: '2021-05-15', fatherId: 'B01', motherId: 'C02', weight: 650, photoUrl: 'https://placehold.co/400x300.png', status: 'Active', category: 'Cow' },
  { id: '102', name: 'Bessie', breed: 'Angus', sex: 'Female', birthDate: '2022-01-20', fatherId: 'B03', motherId: 'C04', weight: 580, photoUrl: 'https://placehold.co/400x300.png', status: 'Active', category: 'Heifer' },
  { id: '103', name: 'Ferdinand', breed: 'Hereford', sex: 'Male', birthDate: '2020-11-10', fatherId: null, motherId: 'C05', weight: 900, photoUrl: 'https://placehold.co/400x300.png', status: 'Active', category: 'Bull' },
  { id: '104', name: 'Annabelle', breed: 'Jersey', sex: 'Female', birthDate: '2023-03-01', fatherId: 'B01', motherId: '101', weight: 150, photoUrl: 'https://placehold.co/400x300.png', status: 'Active', category: 'Calf' },
  { id: '105', name: 'Angus Jr.', breed: 'Angus', sex: 'Male', birthDate: '2023-02-14', fatherId: 'B03', motherId: '102', weight: 180, photoUrl: 'https://placehold.co/400x300.png', status: 'Active', category: 'Calf' },
  { id: '106', name: 'Brutus', breed: 'Brahman', sex: 'Male', birthDate: '2021-08-22', fatherId: null, motherId: null, weight: 820, photoUrl: 'https://placehold.co/400x300.png', status: 'Active', category: 'Steer' },
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
    { category: 'Calves', count: 45, fill: 'hsl(var(--chart-1))' },
    { category: 'Heifers', count: 88, fill: 'hsl(var(--chart-2))' },
    { category: 'Cows', count: 150, fill: 'hsl(var(--chart-3))' },
    { category: 'Steers', count: 39, fill: 'hsl(var(--chart-4))' },
    { category: 'Bulls', count: 20, fill: 'hsl(var(--chart-5))' },
];

const today = new Date();
export const reproductiveEvents: ReproductiveEvent[] = [
  { id: 'e1', animalName: 'Daisy', animalId: '101', eventType: 'Heat', date: addDays(today, 2) },
  { id: 'e2', animalName: 'Bessie', animalId: '102', eventType: 'Pregnancy Check', date: addDays(today, 5) },
  { id: 'e3', animalName: 'Clara', animalId: '107', eventType: 'Due Date', date: addDays(today, 10) },
  { id: 'e4', animalName: 'Bella', animalId: '108', eventType: 'Heat', date: addDays(today, 12) },
];
