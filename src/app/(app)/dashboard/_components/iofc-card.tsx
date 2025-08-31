
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Milk, Wheat, TrendingUp, TrendingDown } from "lucide-react";
import { animals as mockAnimals, milkRecords as mockMilkRecords, rations as mockRations } from "@/lib/mock-data";
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// This would be fetched from user settings in a real app
const MOCK_MILK_PRICE_PER_LITER = 2000; // COP

export default function IofcCard() {
  const iofcMetrics = useMemo(() => {
    const latestDate = mockMilkRecords.reduce((max, r) => r.date > max ? r.date : max, "1970-01-01");
    
    const animalsInProduction = mockAnimals.filter(a => a.status === 'En Producción');

    const totalMilkProduction = mockMilkRecords
        .filter(r => r.date === latestDate)
        .reduce((sum, r) => sum + r.quantity, 0);

    const totalIncome = totalMilkProduction * MOCK_MILK_PRICE_PER_LITER;

    const totalFeedCost = animalsInProduction.reduce((totalCost, animal) => {
        const ration = mockRations.find(r => r.id === animal.assignedRation);
        const amount = animal.rationAmount || 0;
        if (ration && amount > 0) {
            return totalCost + (ration.costPerKg * amount);
        }
        return totalCost;
    }, 0);

    const iofc = totalIncome - totalFeedCost;
    const feedCostPercentage = totalIncome > 0 ? (totalFeedCost / totalIncome) * 100 : 0;

    return {
        latestDate,
        totalIncome,
        totalFeedCost,
        iofc,
        feedCostPercentage,
    };
  }, []);

  return (
    <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                <span>Ingreso Sobre Costo de Alimentación (IOFC)</span>
            </CardTitle>
            <CardDescription>
                Análisis de rentabilidad para el último día de producción registrado ({iofcMetrics.latestDate}).
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">IOFC Total del Hato (Diario)</p>
                <p className="text-4xl font-bold text-green-600">{formatCurrency(iofcMetrics.iofc)}</p>
                <p className="text-xs text-muted-foreground">Este es el margen que queda después de pagar el alimento.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 p-3 bg-green-50/50 rounded-lg border border-green-200">
                    <div className="p-2 bg-green-100 rounded-md">
                        <TrendingUp className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                        <p className="text-muted-foreground">Ingreso por Leche</p>
                        <p className="font-bold">{formatCurrency(iofcMetrics.totalIncome)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-red-50/50 rounded-lg border border-red-200">
                     <div className="p-2 bg-red-100 rounded-md">
                        <TrendingDown className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                        <p className="text-muted-foreground">Costo de Alimentación</p>
                        <p className="font-bold">{formatCurrency(iofcMetrics.totalFeedCost)}</p>
                    </div>
                </div>
            </div>
            
            <div>
                <Label htmlFor="feed-cost-percentage" className="text-xs text-muted-foreground">
                    El costo de alimentación representa el {iofcMetrics.feedCostPercentage.toFixed(1)}% de sus ingresos por leche.
                </Label>
                <Progress value={iofcMetrics.feedCostPercentage} id="feed-cost-percentage" className="h-2 mt-1" />
            </div>
        </CardContent>
    </Card>
  );
}
