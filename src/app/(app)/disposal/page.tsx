
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { animals, disposalCausesData } from '@/lib/mock-data';
import type { Animal } from '@/lib/types';
import { BarChart, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, XAxis, YAxis, Bar } from 'recharts';
import { TrendingDown, Percent, Repeat, ChevronsRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function DisposalPage() {
    const [disposalRate, setDisposalRate] = React.useState(15); // Tasa de descarte anual en %
    const [herdSize, setHerdSize] = React.useState(342); // Tamaño actual del hato
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const discardedAnimals = React.useMemo(() => {
        return animals.filter(a => a.status === 'Vendido' || a.status === 'Fallecido');
    }, []);

    const mortalityRate = React.useMemo(() => {
        const deceasedCount = animals.filter(a => a.status === 'Fallecido').length;
        return animals.length > 0 ? (deceasedCount / animals.length) * 100 : 0;
    }, []);

    const calculatedDisposalRate = React.useMemo(() => {
        return animals.length > 0 ? (discardedAnimals.length / animals.length) * 100 : 0;
    }, [discardedAnimals.length]);

    const replacementHeifers = React.useMemo(() => {
        return Math.ceil((herdSize * (disposalRate / 100)));
    }, [herdSize, disposalRate]);

    const kpiData = [
        { title: "Tasa de Descarte Anual", value: `${calculatedDisposalRate.toFixed(1)}%`, icon: TrendingDown, description: "Total de salidas / Hato" },
        { title: "Tasa de Mortalidad Anual", value: `${mortalityRate.toFixed(1)}%`, icon: TrendingDown, description: "Total de muertes / Hato" },
        { title: "Novillas de Reposición", value: `${replacementHeifers}`, icon: Repeat, description: `Para un hato de ${herdSize} animales` },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">Análisis de Descarte y Reposición</h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {kpiData.map(kpi => (
                    <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className="text-xs text-muted-foreground">{kpi.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-headline">Causas de Descarte</CardTitle>
                        <CardDescription>Distribución de las salidas de animales.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={disposalCausesData}
                                    dataKey="count"
                                    nameKey="cause"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label={(props) => `${props.name} (${props.percent.toFixed(0)}%)`}
                                >
                                    {disposalCausesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="font-headline">Calculadora de Reposición</CardTitle>
                        <CardDescription>Estime cuántas novillas necesita para mantener el tamaño de su hato.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center gap-4">
                        <div className="space-y-2 flex-1 w-full">
                            <Label htmlFor="herd-size">Tamaño Actual del Hato</Label>
                            <Input id="herd-size" type="number" value={herdSize} onChange={e => setHerdSize(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2 flex-1 w-full">
                            <Label htmlFor="disposal-rate">Tasa de Descarte Anual (%)</Label>
                            <Input id="disposal-rate" type="number" value={disposalRate} onChange={e => setDisposalRate(Number(e.target.value))} />
                        </div>
                         <div className="pt-6">
                            <ChevronsRight className="h-8 w-8 text-muted-foreground hidden md:block" />
                        </div>
                        <div className="text-center p-4 rounded-lg bg-secondary flex-1 w-full">
                            <p className="text-sm font-medium text-muted-foreground">Novillas Necesarias por Año</p>
                            <p className="text-4xl font-bold text-primary">{replacementHeifers}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Historial de Animales Descartados</CardTitle>
                </CardHeader>
                <CardContent>
                    {isClient ? (
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Fecha de Salida</TableHead>
                                        <TableHead>Causa</TableHead>
                                        <TableHead>Estado Final</TableHead>
                                        <TableHead className="text-right">Precio Venta (COP)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {discardedAnimals.map(animal => (
                                        <TableRow key={animal.id}>
                                            <TableCell className="font-medium">{animal.id}</TableCell>
                                            <TableCell>{animal.name}</TableCell>
                                            <TableCell>{animal.exitDate ? new Date(animal.exitDate).toLocaleDateString('es-ES') : 'N/A'}</TableCell>
                                            <TableCell><Badge variant="outline">{animal.exitCause}</Badge></TableCell>
                                            <TableCell><Badge variant={animal.status === 'Vendido' ? 'default' : 'destructive'}>{animal.status}</Badge></TableCell>
                                            <TableCell className="text-right">{animal.salePrice ? animal.salePrice.toLocaleString('es-CO') : 'N/A'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="space-y-2">
                           <Skeleton className="h-10 w-full" />
                           <Skeleton className="h-10 w-full" />
                           <Skeleton className="h-10 w-full" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
