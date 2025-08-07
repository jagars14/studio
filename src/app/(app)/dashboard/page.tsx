import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { kpis, reproductiveEvents } from "@/lib/mock-data";
import HerdEvolutionChart from "./_components/herd-evolution-chart";
import HerdDistributionChart from "./_components/herd-distribution-chart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const upcomingEvents = reproductiveEvents.slice(0, 4); // Limitar a 4 eventos

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-headline font-bold">Panel</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Link href={kpi.href} key={kpi.title}>
            <Card className="hover:bg-muted/50 transition-colors">
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
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Evolución del Hato (12 meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <HerdEvolutionChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Distribución del Hato</CardTitle>
            </CardHeader>
            <CardContent>
              <HerdDistributionChart />
            </CardContent>
          </Card>
      </div>

       <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <CalendarClock className="h-6 w-6" />
                    <span>Próximos Eventos</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <ul className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <li key={event.id} className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center rounded-md bg-muted p-2 text-center w-14">
                        <span className="text-sm font-bold text-muted-foreground capitalize">{format(event.date, 'MMM', { locale: es })}</span>
                        <span className="text-xl font-bold">{format(event.date, 'dd', { locale: es })}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{event.animalName} <span className="text-xs text-muted-foreground">({event.animalId})</span></p>
                        <Badge
                          variant={
                            event.eventType === 'Celo' ? 'secondary' :
                            event.eventType === 'Fecha de Parto' ? 'default' :
                            'outline'
                          }
                        >
                          {event.eventType}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
            </CardContent>
            <div className="p-4 mt-auto">
                <Button asChild variant="outline" className="w-full">
                    <Link href="/reproduction">
                        Ver Calendario Completo
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </Card>
    </div>
  );
}
