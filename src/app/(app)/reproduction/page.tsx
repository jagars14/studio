
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { animals } from "@/lib/mock-data";
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import ReproductiveCalculator from "./_components/reproductive-calculator";
import { generateReproductiveEvents } from '@/lib/utils';
import type { ReproductiveEvent } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ReproductionPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Generar eventos dinámicamente a partir de los datos de los animales
  const allEvents = React.useMemo(() => generateReproductiveEvents(animals), []);

  const upcomingEvents = allEvents
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const selectedDayEvents = date 
    ? allEvents.filter(event => isSameDay(event.date, date)) 
    : [];

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
              'outline'
            }
            className="mt-1"
          >
            {event.eventType}
          </Badge>
        </div>
      </li>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Calendario y Calculadora</h1>
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
                    {date ? `Eventos para ${format(date, 'd MMMM yyyy', {locale: es})}` : 'Próximos Eventos'}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
            <ScrollArea className="h-96">
                {selectedDayEvents.length > 0 ? (
                        <ul className="space-y-4 pr-4">
                        {selectedDayEvents.map(renderEvent)}
                    </ul>
                ) : upcomingEvents.length > 0 ? (
                        <ul className="space-y-4 pr-4">
                        {upcomingEvents.slice(0, 10).map(renderEvent)}
                        </ul>
                ) : (
                    <p className="text-muted-foreground">No hay eventos próximos.</p>
                )}
            </ScrollArea>
            </CardContent>
        </Card>
      </div>

      <ReproductiveCalculator />
    </div>
  );
}

