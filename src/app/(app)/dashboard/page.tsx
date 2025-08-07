import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { kpis } from "@/lib/mock-data";
import HerdEvolutionChart from "./_components/herd-evolution-chart";
import HerdDistributionChart from "./_components/herd-distribution-chart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              {kpi.change && (
                <p className="text-xs text-muted-foreground">
                  {kpi.change}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Herd Evolution (12 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <HerdEvolutionChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Herd Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <HerdDistributionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
