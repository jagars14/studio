
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Bell, AlertCircle, Settings, X, ChevronRight } from "lucide-react";
import { format, startOfToday, addDays, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { generateReproductiveEvents } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Animal, ReproductiveEvent } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { animals as mockAnimals } from "@/lib/mock-data"; 
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function NotificationHeader() {
  const [isClient, setIsClient] = useState(false);
  const [attentionDays, setAttentionDays] = useState(7);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // In a real app, this would fetch from Firebase or a global state
    setAnimals(mockAnimals);
  }, []);

  const today = useMemo(() => isClient ? startOfToday() : new Date(), [isClient]);

  const needsAttentionEvents = useMemo(() => {
    if (!isClient) return [];
    const nextDays = addDays(today, attentionDays);
    return generateReproductiveEvents(animals, { includeBirthdays: false })
      .filter(event => isWithinInterval(event.date, { start: today, end: nextDays }));
  }, [isClient, today, attentionDays, animals]);

  if (!isClient || needsAttentionEvents.length === 0) {
    return null; // Don't render anything if there are no notifications or not on the client
  }

  if (!isOpen) {
     return (
        <Button onClick={() => setIsOpen(true)} className="fixed top-20 left-1/2 -translate-x-1/2 z-50 shadow-lg">
            <AlertCircle className="mr-2 h-4 w-4" />
            Mostrar {needsAttentionEvents.length} Alertas Importantes
        </Button>
     )
  }

  return (
    <Card className="border-yellow-500/50 bg-yellow-50/50 relative">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar alertas</span>
        </Button>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-yellow-800"><AlertCircle />Alertas Importantes</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <span>Mostrando eventos para los próximos <strong>{attentionDays}</strong> días.</span>
             <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                        <Settings className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Configurar Periodo</h4>
                            <p className="text-sm text-muted-foreground">
                                Ajuste los días a futuro para mostrar las alertas.
                            </p>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="attention-days">Días</Label>
                            <Input 
                            id="attention-days"
                            type="number" 
                            value={attentionDays}
                            onChange={(e) => setAttentionDays(Number(e.target.value) || 0)}
                            className="w-full"
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
      </CardHeader>
      <CardContent>
         <Collapsible>
            <div className="space-y-2">
                {needsAttentionEvents.slice(0, 3).map((event: ReproductiveEvent) => (
                    <Link href={`/animals/${event.animalId}`} key={event.id} className="flex items-center justify-between p-2 rounded-md hover:bg-yellow-100/50 group">
                        <div className="flex items-center gap-3">
                             <Badge
                                variant={
                                    event.eventType === 'Próximo Celo' ? 'secondary' :
                                    event.eventType === 'Fecha Probable de Parto' ? 'default' :
                                    'outline'
                                }
                                >
                                {event.eventType}
                            </Badge>
                            <p className="text-sm">
                                <span className="font-semibold">{event.animalName}</span> ({event.animalId}) vence el <span className="font-medium">{format(event.date, 'dd MMM', { locale: es })}</span>.
                            </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </Link>
                ))}
            </div>
            {needsAttentionEvents.length > 3 && (
                <CollapsibleContent className="space-y-2 mt-2">
                     {needsAttentionEvents.slice(3).map((event: ReproductiveEvent) => (
                        <Link href={`/animals/${event.animalId}`} key={event.id} className="flex items-center justify-between p-2 rounded-md hover:bg-yellow-100/50 group animate-in fade-in-0 slide-in-from-top-2 duration-300">
                           <div className="flex items-center gap-3">
                                <Badge
                                    variant={
                                        event.eventType === 'Próximo Celo' ? 'secondary' :
                                        event.eventType === 'Fecha Probable de Parto' ? 'default' :
                                        'outline'
                                    }
                                    >
                                    {event.eventType}
                                </Badge>
                                <p className="text-sm">
                                    <span className="font-semibold">{event.animalName}</span> ({event.animalId}) vence el <span className="font-medium">{format(event.date, 'dd MMM', { locale: es })}</span>.
                                </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ))}
                </CollapsibleContent>
            )}
             {needsAttentionEvents.length > 3 && (
                <CollapsibleTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-muted-foreground mt-2">Ver {needsAttentionEvents.length - 3} más...</Button>
                </CollapsibleTrigger>
             )}
         </Collapsible>
      </CardContent>
    </Card>
  );
}
