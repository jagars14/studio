
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { animals } from "@/lib/mock-data";
import { calculateAge, cn, createUTCDate } from "@/lib/utils";
import { CakeSlice, Dna, Weight, Heart, CalendarHeart, Flame, Baby, Milk } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";


const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
        const date = createUTCDate(dateString);
        return format(date, "d 'de' MMMM 'de' yyyy", { locale: es, timeZone: 'UTC' });
    } catch {
        return 'Fecha inválida';
    }
}

export default function AnimalProfilePage({ params }: { params: { animalId: string } }) {
  const animal = animals.find(a => a.id === params.animalId);

  if (!animal) {
    notFound();
  }

  const reproductiveInfo = [
    { label: "Último Parto", value: animal.lastCalvingDate, icon: Baby },
    { label: "Fecha de Celo", value: animal.heatDate, icon: Flame },
    { label: "Fecha de Preñez", value: animal.pregnancyDate, icon: CalendarHeart },
  ].filter(info => info.value);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/animals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" />
        Volver a la Lista de Animales
      </Link>
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
           <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
            <Logo className="h-20 w-20 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-primary">{animal.id}</p>
            <h1 className="font-headline text-4xl font-bold">{animal.name}</h1>
            <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start">
              <Badge variant="secondary">{animal.breed}</Badge>
              <Badge variant="secondary">{animal.sex}</Badge>
              <Badge variant="outline">{animal.category}</Badge>
              {animal.category === 'Vaca' && animal.productionStatus && (
                <Badge variant={animal.productionStatus === 'En Producción' ? 'default' : 'destructive'} className="gap-1">
                  <Milk className="h-3 w-3" />
                  {animal.productionStatus}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
              <CakeSlice className="h-5 w-5 text-accent" />
              <div>
                <p className="font-semibold">Nacimiento</p>
                <p className="text-muted-foreground">{formatDate(animal.birthDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
              <Heart className="h-5 w-5 text-accent" />
              <div>
                <p className="font-semibold">Edad</p>
                <p className="text-muted-foreground">{calculateAge(animal.birthDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
              <Weight className="h-5 w-5 text-accent" />
              <div>
                <p className="font-semibold">Peso</p>
                <p className="text-muted-foreground">{animal.weight} kg</p>
              </div>
            </div>
             <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
              <Dna className="h-5 w-5 text-accent" />
              <div>
                <p className="font-semibold">Padres</p>
                <p className="text-muted-foreground truncate">
                  P: {animal.fatherId || 'N/A'} | M: {animal.motherId || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {animal.sex === 'Hembra' && reproductiveInfo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Información Reproductiva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              {reproductiveInfo.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
                  <Icon className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-muted-foreground">{value ? formatDate(value) : 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
