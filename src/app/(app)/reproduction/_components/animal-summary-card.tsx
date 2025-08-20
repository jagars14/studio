
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Animal } from "@/lib/types";
import { calculateAge, createUTCDate } from "@/lib/utils";
import { CakeSlice, Flame, Baby, CalendarHeart } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
        const utcDate = createUTCDate(dateString);
        return format(utcDate, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
        return 'Fecha inválida';
    }
}

export function AnimalSummaryCard({ animal }: AnimalSummaryCardProps) {

  const reproductiveInfo = [
    { label: "Último Parto", value: formatDate(animal.lastCalvingDate), icon: Baby },
    { label: "Último Celo/Servicio", value: formatDate(animal.heatDate), icon: Flame },
    { label: "Fecha de Preñez", value: formatDate(animal.pregnancyDate), icon: CalendarHeart },
  ].filter(info => info.value && info.value !== 'N/A');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Resumen de Hitos Clave</CardTitle>
        <p className="text-muted-foreground">{animal.name} ({animal.id})</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <CakeSlice className="h-5 w-5 text-accent" />
          <div>
            <p className="font-semibold">Fecha de Nacimiento</p>
            <p className="text-sm text-muted-foreground">{formatDate(animal.birthDate)} ({calculateAge(animal.birthDate)})</p>
          </div>
        </div>
        
        {animal.sex === 'Hembra' && reproductiveInfo.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
                 {reproductiveInfo.map(({ label, value, icon: Icon }) => (
                     <div key={label} className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-accent" />
                        <div>
                            <p className="font-semibold">{label}</p>
                            <p className="text-sm text-muted-foreground">{value}</p>
                        </div>
                    </div>
                ))}
            </div>
          </>
        )}
         {animal.sex === 'Macho' && (
             <p className="text-sm text-muted-foreground pt-2">No hay hitos reproductivos para los machos.</p>
         )}
         {animal.sex === 'Hembra' && reproductiveInfo.length === 0 && (
              <p className="text-sm text-muted-foreground pt-2">No hay fechas reproductivas registradas para este animal.</p>
         )}
      </CardContent>
    </Card>
  );
}
