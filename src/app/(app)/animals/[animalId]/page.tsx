import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { animals } from "@/lib/mock-data";
import { calculateAge } from "@/lib/utils";
import { CakeSlice, Dna, Weight, Heart } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function AnimalProfilePage({ params }: { params: { animalId: string } }) {
  const animal = animals.find(a => a.id === params.animalId);

  if (!animal) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/animals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" />
        Volver a la Lista de Animales
      </Link>
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <Image
            src={animal.photoUrl}
            alt={animal.name}
            width={150}
            height={150}
            className="rounded-full border-4 border-primary object-cover aspect-square"
            data-ai-hint={`${animal.breed.toLowerCase()} cow portrait`}
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-primary">{animal.id}</p>
            <h1 className="font-headline text-4xl font-bold">{animal.name}</h1>
            <p className="text-muted-foreground">{animal.breed} &bull; {animal.sex}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
              <CakeSlice className="h-5 w-5 text-accent" />
              <div>
                <p className="font-semibold">Nacimiento</p>
                <p className="text-muted-foreground">{new Date(animal.birthDate).toLocaleDateString('es-ES')}</p>
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
      {/* Otras pestañas como Historial de Salud irían aquí como tarjetas/componentes separados */}
    </div>
  );
}
