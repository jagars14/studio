
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { animals as mockAnimals } from "@/lib/mock-data"; 
import HerdEvolutionChart from "./_components/herd-evolution-chart";
import HerdDistributionChart from "./_components/herd-distribution-chart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarClock, AlertCircle, Users, TrendingUp, TrendingDown, Milk } from "lucide-react";
import { format, startOfToday, addDays, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { generateReproductiveEvents } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Animal, ReproductiveEvent } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [isNeedsAttentionOpen, setIsNeedsAttentionOpen] = useState(false);
  const [attentionDays, setAttentionDays] = useState(30);
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    setIsClient(true);
    const fetchAnimals = async () => {
      const querySnapshot = await getDocs(collection(db, "animals"));
      const animalsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Animal[];
      setAnimals(animalsData);
    };
    fetchAnimals();
  }, []);

  const today = useMemo(() => isClient ? startOfToday() : new Date(), [isClient]);

  const upcomingEvents = useMemo(() => {
    if (!isClient) return [];
    const allEvents = generateReproductiveEvents(animals);
    const today = new Date();
    return allEvents.filter(event => 
      event.date.getUTCFullYear() === today.getUTCFullYear() &&
      event.date.getUTCMonth() === today.getUTCMonth() &&
      event.date.getUTCDate() >= today.getUTCDate()
    ).slice(0, 4);
  }, [isClient, animals]);

  const needsAttentionEvents = useMemo(() => {
    if (!isClient) return [];
    const nextDays = addDays(today, attentionDays);
    return generateReproductiveEvents(animals, { includeBirthdays: false })
      .filter(event => isWithinInterval(event.date, { start: today, end: nextDays }));
  }, [isClient, today, attentionDays, animals]);

  const calculateMortalityRate = () => {
    const deceasedAnimals = animals.filter(animal => animal.status === 'Fallecido').length;
    const totalAnimals = animals.length;
    return totalAnimals > 0 ? (deceasedAnimals / totalAnimals) * 100 : 0;
  };

  const kpiCards = [
    { title: 'Total de Animales', value: animals.length.toString(), change: '+5 desde el mes pasado', icon: Users, href: '/animals' },
    { title: 'Tasa de Natalidad (12m)', value: '88%', change: '+2%', icon: TrendingUp, href: '/reproduction' },
    { title: 'Producción Promedio/Día', value: '22.5 L', change: '+1.2 L', icon: Milk, href: '/production'},
    { title: 'Tasa de Mortalidad (12m)', value: `${calculateMortalityRate().toFixed(1)}%`, change: '-0.5%', icon: TrendingDown, href: '/animals' },
  ];

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-headline font-bold">Panel</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Link href={kpi.href} key={kpi.title}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                {kpi.change && (
                  <p className="text-xs text-muted-foreground">
                    {kpi.change}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
         <Dialog open={isNeedsAttentionOpen} onOpenChange={setIsNeedsAttentionOpen}>
          <DialogTrigger asChild>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Animales que Necesitan Atención</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{needsAttentionEvents.length}</div>
                 <p className="text-xs text-muted-foreground">
                    Eventos en los próximos {attentionDays} días
                  </p>
              </CardContent>
            </Card>
          </DialogTrigger>
           <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-headline">Animales que Necesitan Atención</DialogTitle>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Evolución del Hato (12 meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <HerdEvolutionChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Distribución del Hato</CardTitle>
            </CardHeader>
            <CardContent>
              <HerdDistributionChart />
            </CardContent>
          </Card>
      </div>

       <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <CalendarClock className="h-6 w-6" />
                    <span>Próximos Eventos del Mes</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                 {upcomingEvents.length > 0 ? (
                    <ul className="space-y-4">
                        {upcomingEvents.map((event) => (
                            <li key={event.id} className="flex items-center gap-4">
                            <div className="flex flex-col items-center justify-center rounded-md bg-muted p-2 text-center w-14">
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
                                >
                                {event.eventType}
                                </Badge>
                            </div>
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <p className="text-muted-foreground text-sm">No hay eventos próximos para lo que resta del mes.</p>
                 )}
            </CardContent>
            <div className="p-4 mt-auto border-t">
                <Button asChild variant="outline" className="w-full">
                    <Link href="/reproduction">
                        Ver Calendario Completo
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </Card>
    </div>
  );
}
