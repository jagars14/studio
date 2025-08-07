import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter, PlusCircle, Search } from "lucide-react";
import { animals } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function AnimalsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold">Inventario de Animales</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Añadir Animal</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por ID o nombre..." className="pl-8" />
            </div>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span>Filtrar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Activo</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Vendido</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Fallecido</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Imagen</TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Raza</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Peso (kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {animals.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell>
                      <Link href={`/animals/${animal.id}`}>
                        <Image
                          src={animal.photoUrl}
                          alt={animal.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                          data-ai-hint={`${animal.breed.toLowerCase()} cow`}
                        />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/animals/${animal.id}`} className="font-medium hover:underline text-primary">
                        {animal.id}
                      </Link>
                    </TableCell>
                    <TableCell>{animal.name}</TableCell>
                    <TableCell>{animal.sex}</TableCell>
                    <TableCell>{animal.breed}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{animal.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{animal.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
