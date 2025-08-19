
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { animals as mockAnimals, healthPlans } from "@/lib/mock-data";
import { generateHealthEvents, cn } from '@/lib/utils';
import type { AnimalHealthEvent } from '@/lib/types';
import { format, isPast, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const getEventStatus = (event: AnimalHealthEvent, completedEvents: string[]) => {
    const isCompleted = completedEvents.includes(event.id);
    if (isCompleted) {
        return { status: 'Completado', icon: CheckCircle2, color: 'text-green-500' };
    }
    if (isPast(event.date)) {
        return { status: 'Vencido', icon: AlertCircle, color: 'text-destructive' };
    }
    const daysUntilDue = differenceInDays(event.date, new Date());
    if (daysUntilDue <= 7) {
        return { status: `Vence en ${daysUntilDue} día(s)`, icon: Clock, color: 'text-yellow-500' };
    }
    return { status: 'Pendiente', icon: Clock, color: 'text-muted-foreground' };
};

export default function HealthPlanPage() {
    const [completedEvents, setCompletedEvents] = React.useState<string[]>(['104-descorne']); // Mock initial completed state
    const rearingAnimals = mockAnimals.filter(a => a.category === 'Ternera' || a.category === 'Novilla');

    const handleEventToggle = (eventId: string, isChecked: boolean) => {
        setCompletedEvents(prev => {
            if (isChecked) {
                return [...prev, eventId];
            } else {
                return prev.filter(id => id !== eventId);
            }
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">Plan de Crianza y Sanidad</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Seguimiento de Animales en Levante</CardTitle>
                    <CardDescription>
                        Supervisa el progreso de los planes sanitarios y de manejo para cada ternera y novilla. Marca las tareas a medida que se completan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {rearingAnimals.map(animal => {
                            const plan = healthPlans.find(p => p.id === (animal.assignedHealthPlan || 'default-calf-plan'));
                            if (!plan) return null;

                            const events = generateHealthEvents(animal, plan);
                            const totalEvents = events.length;
                            const completedCount = events.filter(e => completedEvents.includes(e.id)).length;
                            const progress = totalEvents > 0 ? (completedCount / totalEvents) * 100 : 0;
                            
                            return (
                                <AccordionItem value={animal.id} key={animal.id}>
                                    <AccordionTrigger>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between w-full pr-4">
                                            <div className="text-left">
                                                <p className="font-bold text-base">{animal.name} <span className="font-normal text-muted-foreground">({animal.id})</span></p>
                                                <Badge variant="secondary" className="mt-1">{animal.category}</Badge>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 md:mt-0">
                                                <Progress value={progress} className="w-32 h-2" />
                                                <span className="text-sm text-muted-foreground">{completedCount}/{totalEvents}</span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 p-2">
                                            {events.map(event => {
                                                const { status, icon: Icon, color } = getEventStatus(event, completedEvents);
                                                const isCompleted = status === 'Completado';
                                                return (
                                                    <div key={event.id} className="flex items-start gap-4 p-2 rounded-md hover:bg-muted/50">
                                                        <Checkbox
                                                            id={event.id}
                                                            checked={isCompleted}
                                                            onCheckedChange={(checked) => handleEventToggle(event.id, !!checked)}
                                                            className="mt-1"
                                                        />
                                                        <div className="grid gap-1.5 leading-none">
                                                            <label
                                                                htmlFor={event.id}
                                                                className={cn(
                                                                    "text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                                                    isCompleted && "line-through text-muted-foreground"
                                                                )}
                                                            >
                                                                {event.eventName}
                                                            </label>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Icon className={cn("h-4 w-4", color)} />
                                                                <span>{status}</span>
                                                                <span className="text-xs">
                                                                    (Vence: {format(event.date, "dd MMM yyyy", { locale: es })})
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
