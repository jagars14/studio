
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { reproductiveEvents } from "@/lib/mock-data";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ReproductiveCalculator from "./_components/reproductive-calculator";

export default function ReproductionPage() {
  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-headline font-bold">Calendario y Calculadora</h1>
       <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Calendario de Eventos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Calendar
              locale={es}
              mode="single"
              selected={new Date()}
              className="w-full"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground rounded-md",
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {reproductiveEvents.map((event) => (
                <li key={event.id} className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center rounded-md bg-muted p-2 text-center">
                    <span className="text-sm font-bold text-muted-foreground capitalize">{format(event.date, 'MMM', { locale: es })}</span>
                    <span className="text-xl font-bold">{format(event.date, 'dd', { locale: es })}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{event.animalName} <span className="text-xs text-muted-foreground">({event.animalId})</span></p>
                    <Badge
                      variant={
                        event.eventType === 'Celo' ? 'secondary' :
                        event.eventType === 'Fecha de Parto' ? 'default' :
                        'outline'
                      }
                    >
                      {event.eventType}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <ReproductiveCalculator />
    </div>
  );
}
