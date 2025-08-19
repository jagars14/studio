
'use client'

import * as React from 'react'
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'
import { milkRecords } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const productionData: ProductionData[] = React.useMemo(() => {
    if (!isClient) return []
    
    // Find the most recent date with records
    const mostRecentDate = milkRecords.reduce((max, r) => r.date > max ? r.date : max, milkRecords[0].date);

    const recordsForDate = milkRecords.filter(r => r.date === mostRecentDate);

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

  }, [isClient])

  if (!isClient) {
    // You can return a skeleton loader here
    return <div>Cargando...</div>
  }

  return (
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
  )
}
