
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { animals as mockAnimals } from "@/lib/mock-data"; 
import HerdEvolutionChart from "./_components/herd-evolution-chart";
import HerdDistributionChart from "./_components/herd-distribution-chart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarClock, Users, TrendingUp, TrendingDown, Milk } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { generateReproductiveEvents } from "@/lib/utils";
import type { Animal } from '@/lib/types';

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    setIsClient(true);
    const fetchAnimals = async () => {
      // In a real app, this would fetch from Firebase
      setAnimals(mockAnimals);
    };
    fetchAnimals();
  }, []);


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

  const calculateMortalityRate = () => {
    const deceasedAnimals = animals.filter(animal => animal.status === 'Fallecido').length;
    const totalAnimals = animals.length;
    return totalAnimals > 0 ? (deceasedAnimals / totalAnimals) * 100 : 0;
  };

  const activeAnimals = useMemo(() => animals.filter(a => a.status === 'Activo' || a.status === 'En Producción' || a.status === 'Seca'), [animals]);

  const kpiCards = [
    { title: 'Total de Animales Activos', value: activeAnimals.length.toString(), change: '+5 desde el mes pasado', icon: Users, href: '/animals' },
    { title: 'Tasa de Natalidad (12m)', value: '88%', change: '+2%', icon: TrendingUp, href: '/reproduction' },
    { title: 'Producción Promedio/Día', value: '22.5 L', change: '+1.2 L', icon: Milk, href: '/production'},
    { title: 'Tasa de Mortalidad (12m)', value: `${calculateMortalityRate().toFixed(1)}%`, change: '-0.5%', icon: TrendingDown, href: '/disposal' },
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">Evolución del Hato (12 meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <HerdEvolutionChart />
            </CardContent>
          </Card>
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

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="font-headline">Distribución del Hato</CardTitle>
              </CardHeader>
              <CardContent>
                <HerdDistributionChart />
              </CardContent>
          </Card>
       </div>

    </div>
  );
}
