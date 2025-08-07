'use client'

import { Pie, PieChart, Cell } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '@/components/ui/chart'
import { herdDistributionData } from '@/lib/mock-data'

const chartConfig = {
  count: {
    label: 'Cantidad',
  },
  Terneros: { label: 'Terneros', color: 'hsl(var(--chart-1))' },
  Novillas: { label: 'Novillas', color: 'hsl(var(--chart-2))' },
  Vacas: { label: 'Vacas', color: 'hsl(var(--chart-3))' },
  Novillos: { label: 'Novillos', color: 'hsl(var(--chart-4))' },
  Toros: { label: 'Toros', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig

export default function HerdDistributionChart() {
  return (
    <div className="h-[300px] w-full">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={herdDistributionData}
            dataKey="count"
            nameKey="category"
            innerRadius={60}
            strokeWidth={5}
          >
            {herdDistributionData.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="category" />}
            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ChartContainer>
    </div>
  )
}
