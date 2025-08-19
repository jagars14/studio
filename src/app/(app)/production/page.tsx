
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { animals as mockAnimals, milkRecords as mockRecords, rations as mockRations } from '@/lib/mock-data';
import type { Animal, MilkRecord, Ration } from '@/lib/types';
import { BarChart, DollarSign, ListFilter, PlusCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type AnimalRationAssignment = {
    animalId: string;
    rationId?: string;
    amount?: number;
};

export default function ProductionPage() {
    const [milkRecords, setMilkRecords] = React.useState<MilkRecord[]>(mockRecords);
    const [animals, setAnimals] = React.useState<Animal[]>(mockAnimals);
    const [rations, setRations] = React.useState<Ration[]>(mockRations);
    
    // State to manage ration assignments in the UI
    const [assignedRations, setAssignedRations] = React.useState<AnimalRationAssignment[]>(
        animals.map(a => ({ animalId: a.id, rationId: a.assignedRation, amount: a.rationAmount }))
    );

    const handleRationChange = (animalId: string, rationId: string) => {
        setAssignedRations(prev => prev.map(ar => ar.animalId === animalId ? { ...ar, rationId } : ar));
    };

    const handleAmountChange = (animalId: string, amount: number) => {
        setAssignedRations(prev => prev.map(ar => ar.animalId === animalId ? { ...ar, amount } : ar));
    };

    const getSuggestedRation = (animal: Animal) => {
        return rations.find(ration => ration.suggestionRule(animal))?.id || '';
    };

    const totalFeedCost = React.useMemo(() => {
        return assignedRations.reduce((total, assignment) => {
            if (!assignment.rationId || !assignment.amount || assignment.amount <= 0) {
                return total;
            }
            const ration = rations.find(r => r.id === assignment.rationId);
            if (!ration || !ration.costPerKg) {
                return total;
            }
            return total + (assignment.amount * ration.costPerKg);
        }, 0);
    }, [assignedRations, rations]);


    const kpiData = [
        { title: "Producción Promedio (Hato, 7d)", value: "22.5 L/día", icon: BarChart, description: "+1.2 L vs semana pasada" },
        { 
            title: "Costo Total Diario de Alimentación", 
            value: totalFeedCost.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }), 
            icon: DollarSign, 
            description: "Calculado según las raciones asignadas" 
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">Control de Producción y Alimentación</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

            <Tabs defaultValue="milk">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="milk">Control de Leche</TabsTrigger>
                    <TabsTrigger value="feeding">Gestión de Alimentación</TabsTrigger>
                </TabsList>
                <TabsContent value="milk">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Registros de Producción Láctea</CardTitle>
                                 <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="gap-1">
                                            <PlusCircle className="h-3.5 w-3.5" />
                                            <span>Nuevo Registro</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Registrar Pesaje de Leche</DialogTitle>
                                            <DialogDescription>Añada un nuevo registro de producción para un animal.</DialogDescription>
                                        </DialogHeader>
                                        {/* Formulario de registro iría aquí */}
                                        <form className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="animal-select">Animal</Label>
                                                <Select>
                                                    <SelectTrigger><SelectValue placeholder="Seleccione un animal" /></SelectTrigger>
                                                    <SelectContent>
                                                        {animals.filter(a=>a.sex === 'Hembra').map(a => <SelectItem key={a.id} value={a.id}>{a.name} ({a.id})</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="record-date">Fecha</Label>
                                                <Input id="record-date" type="date" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="session">Sesión</Label>
                                                     <Select>
                                                        <SelectTrigger><SelectValue placeholder="AM/PM" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="AM">AM</SelectItem>
                                                            <SelectItem value="PM">PM</SelectItem>
                                                            <SelectItem value="Único">Único</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="quantity">Cantidad (L)</Label>
                                                    <Input id="quantity" type="number" placeholder="ej: 12.5" />
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full">Guardar Registro</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="relative w-full max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Buscar por animal..." className="pl-8" />
                                </div>
                                <Button variant="outline" size="sm" className="gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span>Filtrar por fecha</span>
                                </Button>
                            </div>
                             <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Animal</TableHead>
                                            <TableHead>Sesión</TableHead>
                                            <TableHead className="text-right">Cantidad (L)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {milkRecords.map(record => (
                                            <TableRow key={record.id}>
                                                <TableCell>{record.date}</TableCell>
                                                <TableCell>{record.animalName} ({record.animalId})</TableCell>
                                                <TableCell><Badge variant="secondary">{record.session}</Badge></TableCell>
                                                <TableCell className="text-right font-medium">{record.quantity}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="feeding">
                     <Card>
                        <CardHeader>
                            <CardTitle>Asignación de Raciones</CardTitle>
                            <CardDescription>Defina la dieta para cada animal y vea el costo asociado.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Animal</TableHead>
                                            <TableHead>Categoría</TableHead>
                                            <TableHead>Ración Asignada</TableHead>
                                            <TableHead>Proveedor / Costo</TableHead>
                                            <TableHead className="text-right">Cantidad (kg/día)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {animals.map(animal => {
                                            const assignment = assignedRations.find(a => a.animalId === animal.id);
                                            const selectedRation = rations.find(r => r.id === (assignment?.rationId || getSuggestedRation(animal)));
                                            
                                            return (
                                                <TableRow key={animal.id}>
                                                    <TableCell className="font-medium">{animal.name} ({animal.id})</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{animal.category}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select 
                                                            value={selectedRation?.id} 
                                                            onValueChange={(value) => handleRationChange(animal.id, value)}
                                                        >
                                                            <SelectTrigger className="max-w-xs">
                                                                <SelectValue placeholder="Asignar ración..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {rations.map(ration => (
                                                                    <SelectItem key={ration.id} value={ration.id}>{ration.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedRation ? (
                                                            <div className="text-sm text-muted-foreground">
                                                                <p>{selectedRation.supplier}</p>
                                                                <p className="font-medium">{selectedRation.costPerKg.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}/kg</p>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">N/A</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Input 
                                                            type="number" 
                                                            value={assignment?.amount || 0}
                                                            onChange={(e) => handleAmountChange(animal.id, parseFloat(e.target.value) || 0)}
                                                            className="w-28 ml-auto" 
                                                            placeholder="kg/día" 
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                             <div className="flex justify-end mt-4">
                                <Button>Guardar Cambios de Alimentación</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
