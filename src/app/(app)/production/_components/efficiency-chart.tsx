
'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import type { Animal, MilkRecord } from '@/lib/types';
import type { AnimalRationAssignment } from '../page';

const chartConfig = {
  milkProduction: {
    label: 'Producción de Leche (L)',
    color: 'hsl(var(--chart-1))',
  },
  feedConsumption: {
    label: 'Consumo de Alimento (kg)',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface EfficiencyChartProps {
  animals: Animal[];
  milkRecords: MilkRecord[];
  assignedRations: AnimalRationAssignment[];
}

export default function EfficiencyChart({ animals, milkRecords, assignedRations }: EfficiencyChartProps) {
  const [isClient, setIsClient] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string>(() => format(new Date(), 'yyyy-MM-dd'));
  const [selectedAnimalId, setSelectedAnimalId] = React.useState<string>('all');

  React.useEffect(() => {
    setIsClient(true);
    if (milkRecords.length > 0) {
      const mostRecentDate = milkRecords.reduce((max, r) => r.date > max ? r.date : max, milkRecords[0].date);
      setSelectedDate(mostRecentDate);
    }
  }, [milkRecords]);

  const efficiencyData = React.useMemo(() => {
    if (!isClient) return [];
    
    let targetAnimals = animals;
    if (selectedAnimalId !== 'all') {
      targetAnimals = animals.filter(a => a.id === selectedAnimalId);
    }

    const dataForDate = targetAnimals.map(animal => {
      const milkForDate = milkRecords
        .filter(r => r.animalId === animal.id && r.date === selectedDate)
        .reduce((sum, r) => sum + r.quantity, 0);

      const rationForAnimal = assignedRations.find(ar => ar.animalId === animal.id);
      const feedConsumption = rationForAnimal?.amount || 0;

      // Only include animals that had milk production or feed consumption on that day
      if (milkForDate > 0 || feedConsumption > 0) {
        return {
          name: `${animal.name} (${animal.id})`,
          milkProduction: milkForDate,
          feedConsumption: feedConsumption,
        };
      }
      return null;
    }).filter(Boolean);
    
    return dataForDate as { name: string; milkProduction: number; feedConsumption: number }[];

  }, [isClient, selectedDate, selectedAnimalId, animals, milkRecords, assignedRations]);

  if (!isClient) {
    return <div>Cargando gráfico...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="date-filter-efficiency">Filtrar por Fecha</Label>
          <Input 
            id="date-filter-efficiency"
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full md:w-auto"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="animal-filter-efficiency">Filtrar por Animal</Label>
          <Select value={selectedAnimalId} onValueChange={setSelectedAnimalId}>
            <SelectTrigger id="animal-filter-efficiency">
              <SelectValue placeholder="Seleccione un animal..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los animales</SelectItem>
              {animals.map(animal => (
                <SelectItem key={animal.id} value={animal.id}>
                  {animal.name} ({animal.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-[400px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer>
            <BarChart 
              data={efficiencyData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent />}
              />
              <Legend />
              <Bar dataKey="milkProduction" fill="var(--color-milkProduction)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="feedConsumption" fill="var(--color-feedConsumption)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
