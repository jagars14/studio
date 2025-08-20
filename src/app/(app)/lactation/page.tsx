
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { animals, milkRecords } from '@/lib/mock-data';
import type { Animal } from '@/lib/types';
import { analyzeLactation, createUTCDate } from '@/lib/utils';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { TrendingUp, Milk, Percent, Target } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function LactationPage() {
    const [selectedAnimalId, setSelectedAnimalId] = React.useState<string | undefined>(animals.find(a => a.category === 'Vaca' && a.productionStatus === 'En Producción')?.id);
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const selectedAnimal = React.useMemo(() => {
        return animals.find(animal => animal.id === selectedAnimalId);
    }, [selectedAnimalId]);

    const lactationAnalysis = React.useMemo(() => {
        if (!isClient || !selectedAnimal) return null;
        return analyzeLactation(selectedAnimal, milkRecords);
    }, [selectedAnimal, isClient]);
    
    const kpiData = lactationAnalysis ? [
        { title: "Producción Pico", value: `${lactationAnalysis.peakProduction.toFixed(1)} L`, icon: TrendingUp },
        { title: "Producción Acumulada", value: `${lactationAnalysis.totalProduction.toFixed(1)} L`, icon: Milk },
        { title: "Proyección a 305 Días", value: `${lactationAnalysis.projected305DayProduction.toFixed(0)} L`, icon: Target },
        { title: "Persistencia (Últ. 10d)", value: `${lactationAnalysis.persistency.toFixed(1)}%`, icon: Percent },
    ] : [];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">Análisis de Lactancia</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Seleccionar Animal</CardTitle>
                    <CardDescription>Elija una vaca para visualizar y analizar su curva de lactancia actual.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-sm">
                        <Label htmlFor="animal-select">Vaca en Producción</Label>
                        <Select value={selectedAnimalId} onValueChange={setSelectedAnimalId}>
                            <SelectTrigger id="animal-select">
                                <SelectValue placeholder="Seleccione un animal..." />
                            </SelectTrigger>
                            <SelectContent>
                                {animals
                                    .filter(a => a.sex === 'Hembra' && a.lastCalvingDate)
                                    .map(animal => (
                                        <SelectItem key={animal.id} value={animal.id}>
                                            {animal.name} ({animal.id})
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {isClient && selectedAnimal && lactationAnalysis ? (
                 <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {kpiData.map(kpi => (
                            <Card key={kpi.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                                    <kpi.icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{kpi.value}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Curva de Lactancia de {selectedAnimal.name}</CardTitle>
                             <CardDescription>
                                Días en Leche (DEL) desde el último parto el {format(createUTCDate(selectedAnimal.lastCalvingDate!), 'dd MMMM yyyy', { locale: es, timeZone: 'UTC' })}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px] w-full">
                            <ResponsiveContainer>
                                <AreaChart data={lactationAnalysis.data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                    <defs>
                                        <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="del" 
                                        name="Días en Leche"
                                        type="number"
                                        domain={['dataMin', 'dataMax']}
                                        label={{ value: 'Días en Leche (DEL)', position: 'insideBottom', offset: -15 }}
                                    />
                                    <YAxis 
                                        unit=" L"
                                        label={{ value: 'Producción (L)', angle: -90, position: 'insideLeft' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            borderRadius: 'var(--radius)',
                                            background: 'hsl(var(--background))',
                                            borderColor: 'hsl(var(--border))'
                                        }}
                                        labelFormatter={(label) => `DEL: ${label}`}
                                        formatter={(value: number, name) => [`${value.toFixed(1)} L`, 'Producción']}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area type="monotone" dataKey="production" name="Producción Real" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorProduction)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Alert>
                    <Milk className="h-4 w-4" />
                    <AlertTitle>No hay datos suficientes</AlertTitle>
                    <AlertDescription>
                        {selectedAnimalId ? "No se encontraron registros de lactancia para el animal seleccionado o le falta una fecha de último parto." : "Por favor, seleccione un animal para ver su análisis de lactancia."}
                    </AlertDescription>
                </Alert>
            )}

        </div>
    );
}
