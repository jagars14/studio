
'use client';

import { useState, useMemo } from "react";
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ListFilter, PlusCircle, Search, MoreHorizontal, FilePenLine, Trash2 } from "lucide-react";
import { animals } from "@/lib/mock-data";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AddAnimalForm } from "./_components/add-animal-form";
import { EditAnimalForm } from "./_components/edit-animal-form";
import type { Animal } from "@/lib/types";

export default function AnimalsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const handleEditClick = (animal: Animal) => {
    setSelectedAnimal(animal);
    setIsEditDialogOpen(true);
  };
  
  // The filtering logic for 'needs_attention' has been moved to the dashboard popup.
  const filteredAnimals = animals;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold">Inventario de Animales</h1>
        <div className="flex items-center gap-2">
           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Añadir Animal</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-headline">Registrar Nuevo Animal</DialogTitle>
                <DialogDescription>
                  Complete la información para añadir un nuevo animal al inventario.
                </DialogDescription>
              </DialogHeader>
              <AddAnimalForm onFinished={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
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
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Raza</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Peso (kg)</TableHead>
                  <TableHead className="w-[50px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnimals.map((animal) => (
                  <TableRow key={animal.id}>
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
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                             <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditClick(animal)}>
                            <FilePenLine className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                             <span>Eliminar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {selectedAnimal && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-headline">Editar Animal</DialogTitle>
              <DialogDescription>
                Modifique la información del animal.
              </DialogDescription>
            </DialogHeader>
            <EditAnimalForm
              animal={selectedAnimal}
              onFinished={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
