
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Lightbulb, BrainCircuit, Milk } from "lucide-react";
import { animals as mockAnimals, milkRecords as mockMilkRecords, rations as mockRations } from "@/lib/mock-data";
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

// --- Mock Business Data ---
const MOCK_MILK_PRICE_PER_LITER = 2000; // COP
const MOCK_OTHER_DAILY_COSTS_PER_ANIMAL = 3000; // Vet, labor, depreciation, etc. COP

export default function BusinessIntelligencePage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // --- State for Simulation ---
    const [feedPriceChange, setFeedPriceChange] = useState(0);
    const [milkPriceChange, setMilkPriceChange] = useState(0);
    const [simulationResult, setSimulationResult] = useState<{ newCostPerLiter: number; profitImpact: number } | null>(null);
    
    // --- Data Processing and KPI Calculation ---
    const businessMetrics = useMemo(() => {
        const activeAnimals = mockAnimals.filter(a => a.status === 'En Producción');
        const latestDate = mockMilkRecords.reduce((max, r) => r.date > max ? r.date : max, "1970-01-01");
        
        const dailyProduction = mockMilkRecords
            .filter(r => r.date === latestDate)
            .reduce((sum, r) => sum + r.quantity, 0);

        const animalData = activeAnimals.map(animal => {
            const production = mockMilkRecords
                .filter(r => r.animalId === animal.id && r.date === latestDate)
                .reduce((sum, r) => sum + r.quantity, 0);
            
            const income = production * MOCK_MILK_PRICE_PER_LITER;

            const assignedRation = animal.assignedRation ? mockRations.find(r => r.id === animal.assignedRation) : null;
            const feedCost = assignedRation && animal.rationAmount ? assignedRation.costPerKg * animal.rationAmount : 0;
            
            const totalCost = feedCost + MOCK_OTHER_DAILY_COSTS_PER_ANIMAL;
            const profitability = income - totalCost;

            return { ...animal, production, income, feedCost, totalCost, profitability };
        }).sort((a, b) => b.profitability - a.profitability);

        const totalFeedCost = animalData.reduce((sum, a) => sum + a.feedCost, 0);
        const totalOtherCosts = activeAnimals.length * MOCK_OTHER_DAILY_COSTS_PER_ANIMAL;
        const totalFarmCosts = totalFeedCost + totalOtherCosts;
        const costPerLiter = dailyProduction > 0 ? totalFarmCosts / dailyProduction : 0;

        return { animalData, totalFarmCosts, dailyProduction, costPerLiter };
    }, []);

    const handleSimulation = () => {
        setIsLoading(true);
        
        const feedMultiplier = 1 + (feedPriceChange / 100);
        const milkMultiplier = 1 + (milkPriceChange / 100);

        const newTotalFeedCost = businessMetrics.animalData.reduce((sum, a) => sum + (a.feedCost * feedMultiplier), 0);
        const totalOtherCosts = businessMetrics.animalData.length * MOCK_OTHER_DAILY_COSTS_PER_ANIMAL;
        const newTotalFarmCosts = newTotalFeedCost + totalOtherCosts;
        
        const newCostPerLiter = businessMetrics.dailyProduction > 0 ? newTotalFarmCosts / businessMetrics.dailyProduction : 0;

        const originalTotalIncome = businessMetrics.dailyProduction * MOCK_MILK_PRICE_PER_LITER;
        const originalProfit = originalTotalIncome - businessMetrics.totalFarmCosts;
        
        const newTotalIncome = businessMetrics.dailyProduction * (MOCK_MILK_PRICE_PER_LITER * milkMultiplier);
        const newProfit = newTotalIncome - newTotalFarmCosts;
        
        const profitImpact = newProfit - originalProfit;

        // Simulate a delay for effect
        setTimeout(() => {
            setSimulationResult({ newCostPerLiter, profitImpact });
            setIsLoading(false);
            toast({
                title: "Simulación Completa",
                description: "Se han calculado los nuevos indicadores de rentabilidad.",
            });
        }, 1000);
    };

    const handleWebhookConsult = () => {
        toast({
            title: "Preparando Consulta para IA",
            description: "En un futuro, esto enviará el escenario a n8n para obtener estrategias.",
        });
        const payload = {
            currentCostPerLiter: businessMetrics.costPerLiter,
            currentProfit: businessMetrics.animalData.reduce((sum, a) => sum + a.profitability, 0),
            simulation: {
                feedPriceChange,
                milkPriceChange,
                ...simulationResult
            },
            context: "El usuario busca estrategias para mitigar el impacto de los cambios de precios simulados."
        };
        console.log("Payload para Webhook n8n:", JSON.stringify(payload, null, 2));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">Inteligencia de Negocio</h1>

            <div className="grid gap-4 md:grid-cols-3">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rentabilidad Total Diaria (Hoy)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(businessMetrics.animalData.reduce((sum, a) => sum + a.profitability, 0))}</div>
                        <p className="text-xs text-muted-foreground">Ingresos por leche menos costos de alimentación y otros.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Costo por Litro de Leche (Hoy)</CardTitle>
                        <Milk className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(businessMetrics.costPerLiter)}</div>
                        <p className="text-xs text-muted-foreground">Costo total de la finca dividido por la producción diaria.</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rentabilidad por Animal (Hoy)</CardTitle>
                    <CardDescription>Clasificación de los animales en producción según su rentabilidad diaria.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Animal</TableHead>
                                    <TableHead className="text-right">Producción (L)</TableHead>
                                    <TableHead className="text-right">Ingreso</TableHead>
                                    <TableHead className="text-right">Costo Alimentación</TableHead>
                                    <TableHead className="text-right text-red-500">Otros Costos</TableHead>
                                    <TableHead className="text-right text-green-600">Rentabilidad</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {businessMetrics.animalData.map(animal => (
                                    <TableRow key={animal.id}>
                                        <TableCell className="font-medium">{animal.name} ({animal.id})</TableCell>
                                        <TableCell className="text-right">{animal.production.toFixed(1)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(animal.income)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(animal.feedCost)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(MOCK_OTHER_DAILY_COSTS_PER_ANIMAL)}</TableCell>
                                        <TableCell className="text-right font-bold">
                                            <Badge variant={animal.profitability >= 0 ? "default" : "destructive"}>
                                                {formatCurrency(animal.profitability)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-6 w-6" />
                        <span>Simulación de Escenarios</span>
                    </CardTitle>
                    <CardDescription>Proyecte el impacto de cambios en los precios sobre su rentabilidad.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="feed-change">Cambio en Precio de Alimento (%)</Label>
                            <Input 
                                id="feed-change"
                                type="number"
                                value={feedPriceChange}
                                onChange={(e) => setFeedPriceChange(parseFloat(e.target.value) || 0)}
                                placeholder="Ej: 10 para un aumento, -5 para una baja"
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="milk-change">Cambio en Precio de Leche (%)</Label>
                            <Input 
                                id="milk-change"
                                type="number"
                                value={milkPriceChange}
                                onChange={(e) => setMilkPriceChange(parseFloat(e.target.value) || 0)}
                                placeholder="Ej: 5 para un aumento, -10 para una baja"
                            />
                        </div>
                    </div>
                     <Button onClick={handleSimulation} disabled={isLoading}>
                        {isLoading ? 'Calculando...' : 'Simular Impacto'}
                     </Button>
                </CardContent>
                {simulationResult && (
                    <CardContent className="border-t pt-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                 <p className="text-sm text-muted-foreground">Nuevo Costo por Litro</p>
                                 <p className="text-2xl font-bold">{formatCurrency(simulationResult.newCostPerLiter)}</p>
                            </div>
                             <div className="p-4 bg-muted/50 rounded-lg">
                                 <p className="text-sm text-muted-foreground">Impacto en Rentabilidad Diaria</p>
                                 <p className={`text-2xl font-bold ${simulationResult.profitImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                     {simulationResult.profitImpact >= 0 ? '+' : ''}{formatCurrency(simulationResult.profitImpact)}
                                 </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button onClick={handleWebhookConsult}>
                                <BrainCircuit className="mr-2 h-4 w-4"/>
                                Consultar IA para Estrategias
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
