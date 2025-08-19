
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Bell, AlertCircle } from "lucide-react";
import { format, startOfToday, addDays, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { generateReproductiveEvents } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Animal, ReproductiveEvent } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { animals as mockAnimals } from "@/lib/mock-data"; 
import Link from 'next/link';

export default function GlobalNotifications() {
  const [isClient, setIsClient] = useState(false);
  const [isNeedsAttentionOpen, setIsNeedsAttentionOpen] = useState(false);
  const [attentionDays, setAttentionDays] = useState(30);
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
    return (
        <Button variant="ghost" size="icon" disabled>
            <Bell className="h-5 w-5" />
        </Button>
    )
  }

  return (
    <Dialog open={isNeedsAttentionOpen} onOpenChange={setIsNeedsAttentionOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {needsAttentionEvents.length > 0 && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
          )}
          <span className="sr-only">Ver notificaciones</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2"><AlertCircle />Animales que Necesitan Atención</DialogTitle>
          <DialogDescription>
            Estos animales tienen eventos reproductivos importantes en los próximos días.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
            <Label htmlFor="attention-days" className="whitespace-nowrap">Ver eventos en los próximos</Label>
            <Input 
              id="attention-days"
              type="number" 
              value={attentionDays}
              onChange={(e) => setAttentionDays(Number(e.target.value) || 0)}
              className="w-24"
            />
            <Label htmlFor="attention-days">días</Label>
        </div>
        <div className="rounded-lg border max-h-[60vh] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal</TableHead>
                <TableHead>Evento Próximo</TableHead>
                <TableHead className="text-right">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {needsAttentionEvents.length > 0 ? (
                needsAttentionEvents.map((event: ReproductiveEvent) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Link href={`/animals/${event.animalId}`} className="font-medium hover:underline text-primary" onClick={() => setIsNeedsAttentionOpen(false)}>
                          {event.animalName} ({event.animalId})
                      </Link>
                    </TableCell>
                    <TableCell>
                        <Badge
                          variant={
                              event.eventType === 'Próximo Celo' ? 'secondary' :
                              event.eventType === 'Fecha Probable de Parto' ? 'default' :
                              'outline'
                          }
                          >
                          {event.eventType}
                          </Badge>
                    </TableCell>
                    <TableCell className="text-right">{format(event.date, 'dd MMM yyyy', { locale: es })}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No hay animales que necesiten atención en el período seleccionado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
