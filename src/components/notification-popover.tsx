
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Bell, AlertCircle, Settings, ChevronRight } from "lucide-react";
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
import { Separator } from './ui/separator';

export default function NotificationPopover() {
  const [isClient, setIsClient] = useState(false);
  const [attentionDays, setAttentionDays] = useState(7);
  const [animals, setAnimals] = useState<Animal[]>([]);

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

  if (!isClient) {
    return null; // Don't render on the server
  }

  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {needsAttentionEvents.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-xs text-white items-center justify-center">{needsAttentionEvents.length}</span>
                    </span>
                )}
                 <span className="sr-only">Abrir notificaciones</span>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none flex items-center gap-2"><AlertCircle className="text-yellow-500"/> Alertas Importantes</h4>
                    <p className="text-sm text-muted-foreground">
                        Mostrando eventos para los próximos {attentionDays} días.
                    </p>
                </div>
                <Separator />
                 <div className="grid gap-2">
                    {needsAttentionEvents.length > 0 ? (
                        <div className="space-y-2">
                            {needsAttentionEvents.slice(0, 5).map((event: ReproductiveEvent) => (
                                <Link href={`/animals/${event.animalId}`} key={event.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary group -mx-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                             <Badge
                                                variant={
                                                    event.eventType === 'Próximo Celo' ? 'secondary' :
                                                    event.eventType === 'Fecha Probable de Parto' ? 'default' :
                                                    'outline'
                                                }
                                                className="mb-1"
                                                >
                                                {event.eventType}
                                            </Badge>
                                            <p className="text-xs">
                                                <span className="font-semibold">{event.animalName}</span> vence el <span className="font-medium">{format(event.date, 'dd MMM', { locale: es })}</span>.
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ))}
                             {needsAttentionEvents.length > 5 && (
                                <p className="text-xs text-muted-foreground text-center">y {needsAttentionEvents.length - 5} más...</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No hay alertas para los próximos {attentionDays} días.</p>
                    )}
                 </div>
                 <Separator />
                  <div className="grid gap-2">
                    <Label htmlFor="attention-days" className="text-xs">Ajustar Periodo</Label>
                    <Input 
                    id="attention-days"
                    type="number" 
                    value={attentionDays}
                    onChange={(e) => setAttentionDays(Number(e.target.value) || 0)}
                    className="w-full h-8"
                    />
                </div>
            </div>
        </PopoverContent>
    </Popover>
  );
}
