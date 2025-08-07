'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'
import { herdEvolutionData } from '@/lib/mock-data'

const chartConfig = {
  count: {
    label: 'Animals',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export default function HerdEvolutionChart() {
  return (
    <div className="h-[300px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={herdEvolutionData} margin={{top: 20, right: 20, left: 20, bottom: 5}}>
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value+"-02").toLocaleString('default', { month: 'short' })}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={['dataMin - 20', 'auto']}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
        </ChartContainer>
    </div>
  )
}
