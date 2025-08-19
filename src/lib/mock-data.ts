
import type { Animal, Kpi, ReproductiveEvent, MilkRecord, Ration } from '@/lib/types';
import { Users, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { addDays, subMonths, format, subDays } from 'date-fns';

// This is now a static list. The "Needs Attention" card is handled dynamically in the dashboard component.
export const kpis: Omit<Kpi, 'href'>[] = [
  {
    title: 'Total de Animales',
    value: '342',
    change: '+5 desde el mes pasado',
    icon: Users,
    href: '/animals',
  },
  {
    title: 'Tasa de Natalidad (12m)',
    value: '88%',
    change: '+2%',
    icon: TrendingUp,
    href: '/reproduction',
  },
  {
    title: 'Tasa de Mortalidad (12m)',
    value: '2.1%',
    change: '-0.5%',
    icon: TrendingDown,
    href: '/animals',
  },
   {
    title: 'Animales que Necesitan Atención',
    value: '12',
    icon: AlertCircle,
    href: '#', // Href is now handled by a dialog trigger
  },
];

export const animals: Animal[] = [
  { id: '101', name: 'Daisy', breed: 'Holstein', sex: 'Hembra', birthDate: '2021-05-15', fatherId: 'B01', motherId: 'C02', weight: 650, status: 'Activo', category: 'Vaca', productionStatus: 'En Producción', lastCalvingDate: '2023-10-01', assignedRation: 'vaca-produccion', rationAmount: 15 },
  { id: '102', name: 'Bessie', breed: 'Angus', sex: 'Hembra', birthDate: '2022-01-20', fatherId: 'B03', motherId: 'C04', weight: 580, status: 'Activo', category: 'Novilla', heatDate: '2024-05-10', assignedRation: 'levante-novillas', rationAmount: 8 },
  { id: '103', name: 'Ferdinand', breed: 'Hereford', sex: 'Macho', birthDate: '2020-11-10', fatherId: null, motherId: 'C05', weight: 900, status: 'Activo', category: 'Toro' },
  { id: '104', name: 'Annabelle', breed: 'Jersey', sex: 'Hembra', birthDate: '2023-03-01', fatherId: 'B01', motherId: '101', weight: 150, status: 'Activo', category: 'Ternera' },
  { id: '105', name: 'Angus Jr.', breed: 'Angus', sex: 'Macho', birthDate: '2023-02-14', fatherId: 'B03', motherId: '102', weight: 180, status: 'Activo', category: 'Ternero' },
  { id: '106', name: 'Brutus', breed: 'Brahman', sex: 'Macho', birthDate: '2021-08-22', fatherId: null, motherId: null, weight: 820, status: 'Activo', category: 'Novillo' },
  { id: '107', name: 'Clara', breed: 'Gyr', sex: 'Hembra', birthDate: '2020-07-11', fatherId: null, motherId: null, weight: 550, status: 'Activo', category: 'Vaca', productionStatus: 'Seca', pregnancyDate: '2024-01-20', assignedRation: 'dieta-secado', rationAmount: 10 },
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

export const milkRecords: MilkRecord[] = [
  { id: 'mr001', animalId: '101', animalName: 'Daisy', date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), session: 'AM', quantity: 12.5 },
  { id: 'mr002', animalId: '101', animalName: 'Daisy', date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), session: 'PM', quantity: 10.2 },
  { id: 'mr003', animalId: '107', animalName: 'Clara', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), session: 'AM', quantity: 9.8 },
  { id: 'mr004', animalId: '101', animalName: 'Daisy', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), session: 'AM', quantity: 12.8 },
  { id: 'mr005', animalId: '101', animalName: 'Daisy', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), session: 'PM', quantity: 10.5 },
];

export const rations: Ration[] = [
    { 
        id: 'vaca-produccion', 
        name: 'Ración Vaca en Producción', 
        description: 'Mezcla alta en energía y proteína para maximizar la producción de leche.',
        suggestionRule: (animal: Animal) => animal.category === 'Vaca' && animal.productionStatus === 'En Producción',
    },
    { 
        id: 'dieta-secado', 
        name: 'Dieta de Secado', 
        description: 'Dieta controlada para preparar a la vaca para el parto y prevenir problemas metabólicos.',
        suggestionRule: (animal: Animal) => animal.category === 'Vaca' && animal.productionStatus === 'Seca',
    },
    { 
        id: 'levante-novillas', 
        name: 'Levante de Novillas', 
        description: 'Alimento balanceado para un crecimiento óptimo y desarrollo de novillas.',
        suggestionRule: (animal: Animal) => ['Novilla', 'Ternera'].includes(animal.category),
    },
     { 
        id: 'mantenimiento-toro', 
        name: 'Mantenimiento de Toro', 
        description: 'Ración para mantener la condición corporal y líbido del toro.',
        suggestionRule: (animal: Animal) => animal.category === 'Toro',
    },
];
