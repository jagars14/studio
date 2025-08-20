
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
import { animals as mockAnimals, milkRecords as mockRecords, rations as mockRations, paddocks, lots, grazingRecords } from '@/lib/mock-data';
import type { Animal, MilkRecord, Ration, Paddock, GrazingRecord, Lot } from '@/lib/types';
import { BarChart, DollarSign, ListFilter, PlusCircle, Search, Trash2, Gauge, Edit, Info, Leaf, Clock, Sun, Moon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import EfficiencyChart from './_components/efficiency-chart';
import { format, subDays, differenceInDays } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { createUTCDate, cn } from '@/lib/utils';
import { es } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export type AnimalRationAssignment = {
    animalId: string;
    rationId?: string;
    amount?: number;
};

const getPaddockStatus = (paddock: Paddock, records: GrazingRecord[]) => {
    const lastRecord = records
        .filter(r => r.paddockId === paddock.id)
        .sort((a,b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())[0];

    if (lastRecord && !lastRecord.exitDate) {
        return { label: 'En Ocupación', color: 'bg-green-500' };
    }
    
    if (lastRecord && lastRecord.exitDate) {
        const restDays = differenceInDays(new Date(), createUTCDate(lastRecord.exitDate));
        if (restDays >= 30 && restDays <= 45) {
             return { label: 'Punto Óptimo', color: 'bg-yellow-500' };
        }
        return { label: `En Descanso (${restDays}d)`, color: 'bg-blue-500' };
    }

    return { label: 'En Descanso', color: 'bg-blue-500' };
};


export default function ProductionPage() {
    const { toast } = useToast();
    const [milkRecords, setMilkRecords] = React.useState<MilkRecord[]>(mockRecords);
    const [animals, setAnimals] = React.useState<Animal[]>(mockAnimals);
    const [rations, setRations] = React.useState<Ration[]>(mockRations);
    const [isClient, setIsClient] = React.useState(false);
    const [searchFilter, setSearchFilter] = React.useState('');
    const [dateFilter, setDateFilter] = React.useState('');

    React.useEffect(() => {
        setIsClient(true);
    }, []);
    
    const [assignedRations, setAssignedRations] = React.useState<AnimalRationAssignment[]>(
        animals.map(a => ({ animalId: a.id, rationId: a.assignedRation, amount: a.rationAmount }))
    );
    
    const filteredMilkRecords = React.useMemo(() => {
        return milkRecords.filter(record => {
            const matchesSearch = searchFilter ? 
                record.animalName.toLowerCase().includes(searchFilter.toLowerCase()) || 
                record.animalId.toLowerCase().includes(searchFilter.toLowerCase()) 
                : true;
            
            const matchesDate = dateFilter ? record.date === dateFilter : true;

            return matchesSearch && matchesDate;
        }).sort((a,b) => createUTCDate(b.date).getTime() - createUTCDate(a.date).getTime());
    }, [milkRecords, searchFilter, dateFilter]);


    const handleRationChange = (animalId: string, rationId: string) => {
        setAssignedRations(prev => prev.map(ar => ar.animalId === animalId ? { ...ar, rationId } : ar));
    };

    const handleAmountChange = (animalId: string, amount: number) => {
        setAssignedRations(prev => prev.map(ar => ar.animalId === animalId ? { ...ar, amount } : ar));
    };
    
    const handleRationDetailChange = (rationId: string, field: keyof Ration, value: string | number) => {
        setRations(prev => prev.map(r => r.id === rationId ? { ...r, [field]: value } : r));
    }
    
    const handleAddNewRation = () => {
        const newId = `ration-${Date.now()}`;
        const newRation: Ration = {
            id: newId,
            name: 'Nueva Ración',
            description: 'Descripción de la nueva ración',
            costPerKg: 0,
            supplier: 'Nuevo Proveedor',
            suggestionRule: () => false,
        };
        setRations(prev => [...prev, newRation]);
    }
    
    const handleRemoveRation = (rationId: string) => {
        if (assignedRations.some(ar => ar.rationId === rationId)) {
            toast({
                variant: 'destructive',
                title: 'Error al eliminar',
                description: 'No se puede eliminar una ración que está asignada a uno o más animales.',
            });
            return;
        }
        setRations(prev => prev.filter(r => r.id !== rationId));
    }
    
    const handleMilkRecordChange = (recordId: string, newQuantity: number) => {
        setMilkRecords(prev => 
            prev.map(r => r.id === recordId ? { ...r, quantity: newQuantity } : r)
        );
    };

    const handleRemoveMilkRecord = (recordId: string) => {
        setMilkRecords(prev => prev.filter(r => r.id !== recordId));
        toast({
            title: "Registro Eliminado",
            description: "El registro de producción ha sido eliminado.",
        });
    };
    
    const handleSaveChanges = (type: 'milk' | 'rations' | 'assignments') => {
        // Here you would typically send the data to your backend/database
        toast({
            title: "Cambios Guardados (Simulación)",
            description: `Los cambios en ${type === 'milk' ? 'producción láctea' : type === 'rations' ? 'raciones' : 'asignaciones'} han sido guardados con éxito.`,
        });
    }

    const getSuggestedRation = (animal: Animal) => {
        return rations.find(ration => ration.suggestionRule(animal))?.id || '';
    };

    const dailyMetrics = React.useMemo(() => {
        const mostRecentDate = milkRecords.reduce((max, r) => r.date > max ? r.date : max, milkRecords[0]?.date || format(new Date(), 'yyyy-MM-dd'));

        const totalMilkToday = milkRecords
            .filter(r => r.date === mostRecentDate)
            .reduce((sum, r) => sum + r.quantity, 0);

        const totalFeedCost = assignedRations.reduce((total, assignment) => {
            if (!assignment.rationId || !assignment.amount || assignment.amount <= 0) {
                return total;
            }
            const ration = rations.find(r => r.id === assignment.rationId);
            if (!ration || !ration.costPerKg) {
                return total;
            }
            return total + (assignment.amount * ration.costPerKg);
        }, 0);

        const totalFeedAmount = assignedRations.reduce((total, assignment) => {
            return total + (assignment.amount || 0);
        }, 0);
        
        const feedEfficiency = totalFeedAmount > 0 ? totalMilkToday / totalFeedAmount : 0;

        return { totalFeedCost, feedEfficiency };

    }, [assignedRations, rations, milkRecords]);


    const kpiData = [
        { title: "Producción Promedio (Hato, 7d)", value: "22.5 L/día", icon: BarChart, description: "+1.2 L vs semana pasada" },
        { 
            title: "Costo Total Diario de Alimentación", 
            value: dailyMetrics.totalFeedCost.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }), 
            icon: DollarSign, 
            description: "Calculado según las raciones asignadas" 
        },
        {
            title: "Eficiencia Alimenticia (Leche/Alimento)",
            value: `${dailyMetrics.feedEfficiency.toFixed(2)} L/kg`,
            icon: Gauge,
            description: "Litros de leche por kg de alimento"
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">Control de Producción y Alimentación</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Análisis de Eficiencia Alimenticia</CardTitle>
                    <CardDescription>Compare la producción de leche con el consumo de alimento por animal en una fecha específica.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EfficiencyChart 
                        animals={animals}
                        milkRecords={milkRecords}
                        assignedRations={assignedRations}
                    />
                </CardContent>
            </Card>

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

            <Tabs defaultValue="milk">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="milk">Control de Leche</TabsTrigger>
                    <TabsTrigger value="assignment">Asignación</TabsTrigger>
                    <TabsTrigger value="rations">Raciones</TabsTrigger>
                    <TabsTrigger value="pasture">Manejo de Praderas</TabsTrigger>
                </TabsList>
                <TabsContent value="milk">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                                <CardTitle>Registros de Producción Láctea</CardTitle>
                                 <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="gap-1 w-full md:w-auto">
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
                                                <Label htmlFor="animal-select-new">Animal</Label>
                                                <Select>
                                                    <SelectTrigger id="animal-select-new"><SelectValue placeholder="Seleccione un animal" /></SelectTrigger>
                                                    <SelectContent>
                                                        {animals.filter(a=>a.sex === 'Hembra').map(a => <SelectItem key={a.id} value={a.id}>{a.name} ({a.id})</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="record-date">Fecha</Label>
                                                <Input id="record-date" type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
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
                             <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Buscar por ID o nombre de animal..." 
                                        className="pl-8"
                                        value={searchFilter}
                                        onChange={(e) => setSearchFilter(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <Label htmlFor="date-filter" className="whitespace-nowrap">Filtrar por Fecha:</Label>
                                    <Input 
                                        id="date-filter"
                                        type="date"
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                        className="w-full md:w-auto"
                                    />
                                </div>
                            </div>
                             <div className="rounded-lg border">
                                {isClient ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Animal</TableHead>
                                                <TableHead className="hidden md:table-cell">Sesión</TableHead>
                                                <TableHead className="text-right w-[150px]">Cantidad (L)</TableHead>
                                                <TableHead className="w-[80px] text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredMilkRecords.map(record => (
                                                <TableRow key={record.id}>
                                                    <TableCell>{format(createUTCDate(record.date), 'dd/MM/yyyy', { locale: es, timeZone: 'UTC' })}</TableCell>
                                                    <TableCell className="font-medium">{record.animalName} <span className="text-xs text-muted-foreground">({record.animalId})</span></TableCell>
                                                    <TableCell className="hidden md:table-cell"><Badge variant="secondary">{record.session}</Badge></TableCell>
                                                    <TableCell className="text-right">
                                                    <Input 
                                                        type="number"
                                                        value={record.quantity}
                                                        onChange={(e) => handleMilkRecordChange(record.id, parseFloat(e.target.value) || 0)}
                                                        className="w-24 ml-auto text-right"
                                                    />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Esta acción eliminará permanentemente el registro de producción. No se puede deshacer.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleRemoveMilkRecord(record.id)}>Continuar</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="space-y-2 p-4">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                )}
                            </div>
                             <div className="flex justify-end mt-4">
                                <Button onClick={() => handleSaveChanges('milk')}>Guardar Cambios</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="assignment">
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
                                            <TableHead className="hidden md:table-cell">Categoría</TableHead>
                                            <TableHead>Ración Asignada</TableHead>
                                            <TableHead className="w-[150px] text-right">Cantidad (kg/día)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {animals.map(animal => {
                                            const assignment = assignedRations.find(a => a.animalId === animal.id);
                                            const selectedRation = rations.find(r => r.id === (assignment?.rationId || getSuggestedRation(animal)));
                                            
                                            return (
                                                <TableRow key={animal.id}>
                                                    <TableCell className="font-medium">{animal.name} <span className="text-xs text-muted-foreground">({animal.id})</span></TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <Badge variant="outline">{animal.category}</Badge>
                                                    </TableCell>
                                                    <TableCell className="min-w-[150px]">
                                                        <Select 
                                                            value={selectedRation?.id} 
                                                            onValueChange={(value) => handleRationChange(animal.id, value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Asignar ración..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {rations.map(ration => (
                                                                    <SelectItem key={ration.id} value={ration.id}>{ration.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
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
                                <Button onClick={() => handleSaveChanges('assignments')}>Guardar Cambios de Alimentación</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="rations">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Gestionar Raciones</CardTitle>
                                    <CardDescription>Añada, edite o elimine los tipos de alimento disponibles.</CardDescription>
                                </div>
                                <Button size="sm" onClick={handleAddNewRation}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Añadir Ración
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre de la Ración</TableHead>
                                            <TableHead className="hidden md:table-cell">Proveedor</TableHead>
                                            <TableHead className="w-[200px]">Costo por Kg (COP)</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rations.map(ration => (
                                            <TableRow key={ration.id}>
                                                <TableCell>
                                                    <Input value={ration.name} onChange={e => handleRationDetailChange(ration.id, 'name', e.target.value)} />
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Input value={ration.supplier} onChange={e => handleRationDetailChange(ration.id, 'supplier', e.target.value)} />
                                                </TableCell>
                                                <TableCell>
                                                    <Input type="number" value={ration.costPerKg} onChange={e => handleRationDetailChange(ration.id, 'costPerKg', parseFloat(e.target.value) || 0)} />
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRation(ration.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                             </div>
                             <div className="flex justify-end mt-4">
                                <Button onClick={() => handleSaveChanges('rations')}>Guardar Cambios de Raciones</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="pasture">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Catastro y Estado de Praderas</CardTitle>
                                    <CardDescription>Vista general del estado de sus potreros.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {paddocks.map(paddock => {
                                        const status = getPaddockStatus(paddock, grazingRecords);
                                        return (
                                            <Card key={paddock.id}>
                                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                    <CardTitle className="text-base font-medium">{paddock.name}</CardTitle>
                                                    <Leaf className="h-4 w-4 text-muted-foreground" />
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className={cn("h-2 w-2 rounded-full", status.color)}></span>
                                                        <span>{status.label}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-2">{paddock.area} Ha • {paddock.forageType}</p>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Historial de Rotación</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Potrero</TableHead>
                                                <TableHead>Lote</TableHead>
                                                <TableHead>Entrada</TableHead>
                                                <TableHead>Salida</TableHead>
                                                <TableHead className="text-right">Días Ocup.</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {grazingRecords.map(rec => (
                                                <TableRow key={rec.id}>
                                                    <TableCell>{paddocks.find(p => p.id === rec.paddockId)?.name}</TableCell>
                                                     <TableCell>{lots.find(l => l.id === rec.lotId)?.name}</TableCell>
                                                    <TableCell>{format(createUTCDate(rec.entryDate), 'dd/MM/yy')}</TableCell>
                                                    <TableCell>{rec.exitDate ? format(createUTCDate(rec.exitDate), 'dd/MM/yy') : 'En Ocupación'}</TableCell>
                                                    <TableCell className="text-right">{rec.exitDate ? differenceInDays(createUTCDate(rec.exitDate), createUTCDate(rec.entryDate)) : '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Registrar Rotación</CardTitle>
                                    <CardDescription>Registre la entrada o salida de un lote.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="paddock-select">Potrero</Label>
                                        <Select><SelectTrigger><SelectValue placeholder="Seleccionar potrero..." /></SelectTrigger><SelectContent>{paddocks.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lot-select">Lote</Label>
                                        <Select><SelectTrigger><SelectValue placeholder="Seleccionar lote..." /></SelectTrigger><SelectContent>{lots.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent></Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="entry-date">Fecha de Entrada</Label>
                                        <Input id="entry-date" type="date" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="aforo">Aforo (kg MS/Ha) (Opcional)</Label>
                                        <Input id="aforo" type="number" placeholder="Ej: 2500" />
                                    </div>
                                    <Button className="w-full">Registrar Entrada</Button>
                                    <Button variant="outline" className="w-full">Registrar Salida</Button>
                                </CardContent>
                            </Card>
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Recomendaciones Inteligentes</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc list-inside space-y-2 mt-2">
                                        <li>Alerta: El Potrero 'El Rincón' lleva 45 días de descanso. Ha llegado a su punto óptimo para el pastoreo.</li>
                                        <li>El Lote 1, al pastorear en 'La Loma', mantuvo su producción con 15% menos de concentrado.</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
