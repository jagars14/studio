
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';

type CalculatorMode = 'parto' | 'celo' | 'prenez';
type TimelineEvent = {
  icon: string;
  title: string;
  date: Date;
  description: string;
  colorClass: string;
};

const paramData = [
    { value: 283, label: 'Días de Gestación', color: 'bg-green-50 border-green-200 text-green-800' },
    { value: 21, label: 'Días del Ciclo Estral', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { value: 50, label: 'Días de Espera (PEV)', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
    { value: 35, label: 'Días Chequeo Preñez', color: 'bg-purple-50 border-purple-200 text-purple-800' },
]

export default function ReproductiveCalculator() {
  const [mode, setMode] = useState<CalculatorMode>('parto');
  const [results, setResults] = useState<TimelineEvent[]>([]);

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const subtractDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      result.setDate(result.getDate() - days);
      return result;
  };

  const formatDateString = (date?: Date): string => {
    if (!date || isNaN(date.getTime())) return 'Fecha inválida';
    const utcDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    return format(utcDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const PEV_DAYS = 50;
    const CYCLE_DAYS = 21;
    const PREG_CHECK_DAYS = 35;
    const GESTATION_DAYS = 283;
    const DRY_OFF_DAYS = 60;

    let newResults: TimelineEvent[] = [];

    switch (mode) {
      case 'parto': {
        const startDate = new Date(formData.get('dateParto') as string);
        if (isNaN(startDate.getTime())) return;
        
        const pevEnd = addDays(startDate, PEV_DAYS);
        const heat1 = pevEnd;
        const heat2 = addDays(heat1, CYCLE_DAYS);
        const heat3 = addDays(heat2, CYCLE_DAYS);
        
        newResults = [
            { icon: '🏁', title: 'Fin del Período de Espera Voluntario (PEV)', date: pevEnd, description: 'La vaca está lista para el primer servicio. Iniciar vigilancia intensiva de celos.', colorClass: 'text-blue-600' },
            { icon: '❤️', title: '1ra Fecha Probable de Celo', date: heat1, description: 'Primera oportunidad de inseminación post-parto.', colorClass: 'text-red-600' },
            { icon: '❤️', title: '2da Fecha Probable de Celo', date: heat2, description: 'Segunda oportunidad si no se detectó o sirvió en la primera.', colorClass: 'text-red-600' },
            { icon: '❤️', title: '3ra Fecha Probable de Celo', date: heat3, description: 'Tercera oportunidad. Vigilar de cerca.', colorClass: 'text-red-600' },
        ];
        break;
      }
      case 'celo': {
        const serviceDate = new Date(formData.get('dateCelo') as string);
        if (isNaN(serviceDate.getTime())) return;

        const returnHeat = addDays(serviceDate, CYCLE_DAYS);
        const pregCheck = addDays(serviceDate, PREG_CHECK_DAYS);
        const dryOff = addDays(serviceDate, GESTATION_DAYS - DRY_OFF_DAYS);
        const dueDate = addDays(serviceDate, GESTATION_DAYS);

        newResults = [
            { icon: '👀', title: 'Vigilar Retorno a Celo', date: returnHeat, description: 'Fecha crítica. Si no hay celo, es una buena señal de preñez.', colorClass: 'text-orange-600' },
            { icon: '🔬', title: 'Chequeo de Preñez', date: pregCheck, description: 'Confirmar gestación mediante palpación o ecografía.', colorClass: 'text-purple-600' },
            { icon: '💧', title: 'Fecha de Secado', date: dryOff, description: 'Iniciar período seco para preparar a la vaca para el parto.', colorClass: 'text-teal-600' },
            { icon: '🐮', title: 'Fecha Probable de Parto', date: dueDate, description: 'Preparar lote de maternidad y cuidados periparto.', colorClass: 'text-green-600' },
        ];
        break;
      }
      case 'prenez': {
        const confirmDate = new Date(formData.get('datePrenez') as string);
        const gestDays = parseInt(formData.get('diasGestacion') as string, 10);
        if (isNaN(confirmDate.getTime()) || isNaN(gestDays)) return;

        const serviceDate = subtractDays(confirmDate, gestDays);
        const dryOff = addDays(serviceDate, GESTATION_DAYS - DRY_OFF_DAYS);
        const dueDate = addDays(serviceDate, GESTATION_DAYS);

        newResults = [
            { icon: '✅', title: 'Fecha de Servicio Estimada', date: serviceDate, description: `Calculada restando ${gestDays} días a la fecha de confirmación.`, colorClass: 'text-gray-600' },
            { icon: '💧', title: 'Fecha de Secado', date: dryOff, description: 'Iniciar período seco para preparar a la vaca para el parto.', colorClass: 'text-teal-600' },
            { icon: '🐮', title: 'Fecha Probable de Parto', date: dueDate, description: 'Preparar lote de maternidad y cuidados periparto.', colorClass: 'text-green-600' },
        ];
        break;
      }
    }
    setResults(newResults);
  };
  
  const handleModeChange = (newMode: CalculatorMode) => {
    setMode(newMode);
    setResults([]);
  }

  const renderForm = () => {
    switch (mode) {
      case 'parto':
        return (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
            <Label htmlFor="dateParto" className="font-semibold text-lg whitespace-nowrap">Fecha de Último Parto:</Label>
            <Input type="date" id="dateParto" name="dateParto" className="w-full p-2" required />
            <Button type="submit" className="w-full sm:w-auto px-6 py-2 font-semibold">Calcular</Button>
          </form>
        );
      case 'celo':
        return (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
            <Label htmlFor="dateCelo" className="font-semibold text-lg whitespace-nowrap">Fecha de Servicio:</Label>
            <Input type="date" id="dateCelo" name="dateCelo" className="w-full p-2" required />
            <Button type="submit" className="w-full sm:w-auto px-6 py-2 font-semibold">Calcular</Button>
          </form>
        );
      case 'prenez':
        return (
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
            <Label htmlFor="datePrenez" className="font-semibold text-lg whitespace-nowrap">Fecha de Confirmación:</Label>
            <Input type="date" id="datePrenez" name="datePrenez" className="w-full md:w-auto p-2" required />
            <Label htmlFor="diasGestacion" className="font-semibold text-lg whitespace-nowrap">Días de Gestación:</Label>
            <Input type="number" id="diasGestacion" name="diasGestacion" className="w-full md:w-24 p-2" defaultValue="35" required />
            <Button type="submit" className="w-full sm:w-auto px-6 py-2 font-semibold">Calcular</Button>
          </form>
        );
    }
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-3xl sm:text-4xl font-bold text-accent mb-2">Calculadora de Gestión Reproductiva Bovina</CardTitle>
                <CardDescription className="text-lg">Una herramienta proactiva para optimizar la eficiencia de su hato.</CardDescription>
            </CardHeader>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary mb-2">Parámetros Fisiológicos Clave</CardTitle>
                <CardDescription>Todos los cálculos se basan en estos promedios estándar de la industria.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {paramData.map(param => (
                        <div key={param.label} className={cn("p-4 rounded-lg border", param.color)}>
                            <p className="text-2xl font-bold">{param.value}</p>
                            <p className="text-sm">{param.label}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-primary mb-2">Iniciar un Nuevo Cálculo</CardTitle>
                <CardDescription>Seleccione el dato más reciente que tiene del animal para generar su calendario de eventos.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Button onClick={() => handleModeChange('parto')} variant={mode === 'parto' ? 'default' : 'outline'} className="py-3 h-auto font-semibold text-lg">🗓️ Último Parto</Button>
                    <Button onClick={() => handleModeChange('celo')} variant={mode === 'celo' ? 'default' : 'outline'} className="py-3 h-auto font-semibold text-lg">❤️ Celo / Servicio</Button>
                    <Button onClick={() => handleModeChange('prenez')} variant={mode === 'prenez' ? 'default' : 'outline'} className="py-3 h-auto font-semibold text-lg">🔬 Preñez Confirmada</Button>
                </div>
                <div>{renderForm()}</div>

                {results.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-2xl font-bold text-center mb-6 text-primary">Calendario Proyectado</h3>
                    <div className="relative border-l-2 border-muted ml-5">
                    {results.map((item, index) => (
                        <div key={index} className="relative pl-12 pb-8">
                            <div className={cn("absolute left-0 top-1 -translate-x-1/2 text-2xl bg-card p-1 rounded-full", item.colorClass)}>
                                {item.icon}
                            </div>
                            <div className="ml-4">
                                <h4 className={cn("font-bold text-lg", item.colorClass)}>{item.title}</h4>
                                <p className="font-semibold text-xl text-card-foreground capitalize">{formatDateString(item.date)}</p>
                                <p className="text-muted-foreground mt-1">{item.description}</p>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                )}
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary mb-2">Consideraciones del Veterinario</CardTitle>
                <CardDescription>Recuerde que esta herramienta es una guía. El éxito reproductivo real depende de un manejo integral.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                 <div className="bg-secondary/50 p-4 rounded-lg border flex flex-col">
                    <h3 className="font-bold text-lg mb-2">🎯 Condición Corporal (CC): El Motor de la Fertilidad</h3>
                    <p className="text-muted-foreground mb-4">La CC es una medida de las reservas de energía de la vaca, crucial para su capacidad de ciclar y mantener una preñez. Se evalúa visualmente en una escala de 1 (muy flaca) a 5 (obesa).</p>
                    <Alert>
                        <AlertTitle className="font-semibold">🏆 Objetivos Clave de CC</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc list-inside mt-2">
                                <li><strong>Al Parto:</strong> 3.25 - 3.75. Una buena reserva para soportar la lactancia inicial.</li>
                                <li><strong>Al Servicio (Inseminación):</strong> 3.0 - 3.5. Condición ideal para una ovulación de calidad y concepción.</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="mt-4 w-full">Ver Guía Visual</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>Guía Visual de Condición Corporal (Escala 1-5)</DialogTitle>
                                <DialogDescription>
                                    Observe la base de la cola, las costillas y la columna para asignar un puntaje.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="relative w-full h-[60vh]">
                                <Image 
                                    src="/CCC Bovino.jpeg" 
                                    alt="Guía de Condición Corporal" 
                                    fill
                                    style={{objectFit: 'contain'}}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg border">
                    <h3 className="font-bold text-lg mb-2"> uterus Salud Uterina</h3>
                    <p className="text-muted-foreground">Un chequeo postparto es vital para descartar infecciones (metritis) que impidan una nueva preñez. El Período de Espera Voluntario (PEV) es para la recuperación.</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg border">
                    <h3 className="font-bold text-lg mb-2">👀 Detección de Celos</h3>
                    <p className="text-muted-foreground">Es la principal causa de fallos. De nada sirve calcular fechas si el personal no detecta el celo. La observación (mañana y tarde) es clave.</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg border">
                    <h3 className="font-bold text-lg mb-2">✍️ Registros Confiables</h3>
                    <p className="text-muted-foreground">La precisión de esta calculadora depende 100% de la calidad de sus datos. ¡Un dato erróneo, un plan erróneo!</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
