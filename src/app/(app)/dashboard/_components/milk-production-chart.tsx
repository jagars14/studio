
'use client'

import * as React from 'react'
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'
import { milkRecords, animals } from '@/lib/mock-data'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'

type ProductionData = {
  name: string
  production: number
}

const chartConfig = {
  production: {
    label: 'Producción (L)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export default function MilkProductionChart() {
  const [isClient, setIsClient] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<string>(() => format(new Date(), 'yyyy-MM-dd'));
  const [selectedAnimalId, setSelectedAnimalId] = React.useState<string>('all');

  React.useEffect(() => {
    setIsClient(true)
    // Set default date to the most recent record date if available
    if (milkRecords.length > 0) {
      const mostRecentDate = milkRecords.reduce((max, r) => r.date > max ? r.date : max, milkRecords[0].date);
      setSelectedDate(mostRecentDate);
    }
  }, [])

  const productionData: ProductionData[] = React.useMemo(() => {
    if (!isClient) return []
    
    let recordsForDate = milkRecords.filter(r => r.date === selectedDate);

    if (selectedAnimalId !== 'all') {
      recordsForDate = recordsForDate.filter(r => r.animalId === selectedAnimalId);
    }

    const aggregated: { [key: string]: number } = {}
    recordsForDate.forEach(record => {
      const key = `${record.animalName} (${record.animalId})`
      if (!aggregated[key]) {
        aggregated[key] = 0
      }
      aggregated[key] += record.quantity
    })

    return Object.entries(aggregated).map(([name, production]) => ({
      name,
      production,
    })).sort((a,b) => b.production - a.production)

  }, [isClient, selectedDate, selectedAnimalId])

  if (!isClient) {
    // You can return a skeleton loader here
    return <div>Cargando...</div>
  }
  
  const producingCows = animals.filter(a => a.category === 'Vaca' && a.productionStatus === 'En Producción');

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 space-y-2">
            <Label htmlFor="date-filter">Filtrar por Fecha</Label>
            <Input 
                id="date-filter"
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full md:w-auto"
            />
        </div>
        <div className="flex-1 space-y-2">
            <Label htmlFor="animal-filter">Filtrar por Animal</Label>
            <Select value={selectedAnimalId} onValueChange={setSelectedAnimalId}>
                <SelectTrigger id="animal-filter">
                    <SelectValue placeholder="Seleccione un animal..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los animales</SelectItem>
                    {producingCows.map(animal => (
                        <SelectItem key={animal.id} value={animal.id}>
                            {animal.name} ({animal.id})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
      <div className="h-[350px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer>
            <BarChart 
              data={productionData} 
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120} 
                tick={{ fontSize: 12 }} 
                interval={0}
              />
              <Tooltip 
                  cursor={{fill: 'hsl(var(--muted))'}}
                  content={<ChartTooltipContent />}
              />
              <Legend />
              <Bar dataKey="production" fill="var(--color-production)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </>
  )
}
