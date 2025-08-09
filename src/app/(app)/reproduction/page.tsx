
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { animals } from "@/lib/mock-data";
import { format, isSameDay, isSameMonth, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import ReproductiveCalculator from "./_components/reproductive-calculator";
import { generateReproductiveEvents, cn } from '@/lib/utils';
import type { ReproductiveEvent } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AnimalSummaryCard } from './_components/animal-summary-card';

export default function ReproductionPage() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedAnimalId, setSelectedAnimalId] = React.useState<string | 'all'>('all');
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setDate(new Date());
  }, []);

  const selectedAnimal = React.useMemo(() => {
      if (selectedAnimalId === 'all') return null;
      return animals.find(animal => animal.id === selectedAnimalId) || null;
  }, [selectedAnimalId]);

  const filteredAnimals = React.useMemo(() => {
    if (!selectedAnimal) {
      return animals;
    }
    return [selectedAnimal];
  }, [selectedAnimal]);

  const allEvents = React.useMemo(() => generateReproductiveEvents(filteredAnimals), [filteredAnimals]);

  const currentMonthEvents = React.useMemo(() => {
    if (!isClient) return [];
    const today = startOfToday();
    return allEvents
      .filter(event => isSameMonth(event.date, currentMonth) && event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [allEvents, currentMonth, isClient]);


  const selectedDayEvents = date
    ? allEvents.filter(event => isSameDay(event.date, date))
    : [];

  const eventsToShow = date && isClient ? selectedDayEvents : currentMonthEvents;

  const renderEvent = (event: ReproductiveEvent) => (
     <li key={event.id} className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center rounded-md bg-muted p-2 text-center w-14 shrink-0">
          <span className="text-sm font-bold text-muted-foreground capitalize">{format(event.date, 'MMM', { locale: es })}</span>
          <span className="text-xl font-bold">{format(event.date, 'dd', { locale: es })}</span>
        </div>
        <div>
          <p className="font-semibold">{event.animalName} <span className="text-xs text-muted-foreground">({event.animalId})</span></p>
          <Badge
            variant={
              event.eventType === 'Próximo Celo' ? 'secondary' :
              event.eventType === 'Fecha Probable de Parto' ? 'default' :
              event.eventType === 'Cumpleaños' ? 'outline' :
              'outline'
            }
            className={cn(
                event.eventType === 'Cumpleaños' && 'border-yellow-500 text-yellow-700',
                "mt-1"
            )}
          >
            {event.eventType}
          </Badge>
        </div>
      </li>
  );

  if (!isClient) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Calendario y Calculadora</h1>

      <Card>
        <CardContent className="pt-6">
            <div className="max-w-xs">
                <Label htmlFor="animal-filter" className="font-semibold">Filtrar por Animal</Label>
                <Select value={selectedAnimalId} onValueChange={(value) => setSelectedAnimalId(value || 'all')}>
                    <SelectTrigger id="animal-filter" className="mt-2">
                        <SelectValue placeholder="Seleccionar un animal..." />
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
        </CardContent>
      </Card>
      
      {selectedAnimal && (
          <AnimalSummaryCard animal={selectedAnimal} />
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="font-headline">Calendario de Eventos</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                locale={es}
                modifiers={{
                events: allEvents.map(e => e.date),
                }}
                modifiersClassNames={{
                events: 'bg-accent/50 rounded-full',
                }}
                className="w-auto"
            />
            </CardContent>
        </Card>
        <Card className="lg:col-span-2 flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">
                    {date && isSameDay(date, new Date()) ? 'Eventos Próximos del Mes' : date ? `Eventos para ${format(date, 'd MMMM yyyy', {locale: es})}` : 'Eventos Próximos del Mes'}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
            <ScrollArea className="h-96">
                {eventsToShow.length > 0 ? (
                    <ul className="space-y-4 pr-4">
                        {eventsToShow.map(renderEvent)}
                    </ul>
                ) : (
                    <p className="text-muted-foreground text-sm">
                      {date ? 'No hay eventos para este día.' : 'No hay eventos programados para lo que resta del mes.'}
                    </p>
                )}
            </ScrollArea>
            </CardContent>
        </Card>
      </div>

      <ReproductiveCalculator />
    </div>
  );
}
