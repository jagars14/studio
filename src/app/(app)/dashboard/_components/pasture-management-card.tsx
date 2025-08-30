
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, MapPin, Leaf, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Type definition for a pasture
type Pasture = {
  id: string;
  name: string;
  area: number; // in hectares
  status: 'Descansando' | 'En Pastoreo' | 'Lista para Rotación' | 'En Mantenimiento';
  lastRotation?: string;
  grassType: string;
};

// Mock data for initial pastures
const initialPastures: Pasture[] = [
  { id: 'pradera-1', name: 'Potrero El Mirador', area: 5, status: 'En Pastoreo', lastRotation: '2024-07-15', grassType: 'Brachiaria' },
  { id: 'pradera-2', name: 'Potrero La Vaca Gorda', area: 4.5, status: 'Lista para Rotación', lastRotation: '2024-06-20', grassType: 'Kikuyo' },
  { id: 'pradera-3', name: 'Potrero El Reposo', area: 6, status: 'Descansando', lastRotation: '2024-05-30', grassType: 'Estrella' },
];

// Form component for adding/editing a pasture
function PastureForm({ pasture, onSave, onCancel }: { pasture?: Pasture | null, onSave: (pasture: Omit<Pasture, 'id'> & { id?: string }) => void, onCancel: () => void }) {
  const [name, setName] = useState(pasture?.name || '');
  const [area, setArea] = useState(pasture?.area || 0);
  const [status, setStatus] = useState(pasture?.status || 'Descansando');
  const [grassType, setGrassType] = useState(pasture?.grassType || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || area <= 0 || !grassType) {
        // Simple validation
        alert('Por favor complete todos los campos requeridos.');
        return;
    }
    onSave({ id: pasture?.id, name, area, status, grassType });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pasture-name">Nombre del Potrero</Label>
        <Input id="pasture-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pasture-area">Área (hectáreas)</Label>
          <Input id="pasture-area" type="number" value={area} onChange={(e) => setArea(parseFloat(e.target.value) || 0)} required />
        </div>
        <div className="space-y-2">
           <Label htmlFor="pasture-status">Estado</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as Pasture['status'])}>
              <SelectTrigger id="pasture-status">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Descansando">Descansando</SelectItem>
                <SelectItem value="En Pastoreo">En Pastoreo</SelectItem>
                <SelectItem value="Lista para Rotación">Lista para Rotación</SelectItem>
                <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </div>
       <div className="space-y-2">
        <Label htmlFor="pasture-grass">Tipo de Pasto</Label>
        <Input id="pasture-grass" value={grassType} onChange={(e) => setGrassType(e.target.value)} required placeholder="Ej: Kikuyo"/>
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Guardar Cambios</Button>
      </DialogFooter>
    </form>
  );
}


export default function PastureManagementCard() {
  const [pastures, setPastures] = useState<Pasture[]>(initialPastures);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPasture, setEditingPasture] = useState<Pasture | null>(null);
  const { toast } = useToast();

  const handleAddClick = () => {
    setEditingPasture(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (pasture: Pasture) => {
    setEditingPasture(pasture);
    setIsFormOpen(true);
  };

  const handleSave = (data: Omit<Pasture, 'id'> & { id?: string }) => {
    if (data.id) {
      // Editing existing pasture
      setPastures(pastures.map(p => p.id === data.id ? { ...p, ...data, id: data.id } : p));
      toast({ title: "Pradera Actualizada", description: `El potrero "${data.name}" ha sido actualizado.` });
    } else {
      // Adding new pasture
      const newPasture: Pasture = {
        ...data,
        id: `pradera-${Date.now()}`,
        lastRotation: new Date().toISOString().split('T')[0]
      };
      setPastures([...pastures, newPasture]);
      toast({ title: "Pradera Añadida", description: `El potrero "${data.name}" ha sido creado.` });
    }
    setIsFormOpen(false);
    setEditingPasture(null);
  };
  
  const handleDelete = (pastureId: string) => {
    setPastures(pastures.filter(p => p.id !== pastureId));
    toast({
      variant: "destructive",
      title: "Pradera Eliminada",
      description: "El potrero ha sido eliminado del catastro."
    });
  };

  const getStatusBadgeVariant = (status: Pasture['status']) => {
    switch (status) {
      case 'En Pastoreo': return 'default';
      case 'Lista para Rotación': return 'secondary';
      case 'Descansando': return 'outline';
      case 'En Mantenimiento': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="font-headline flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            <span>Catastro y Estado de Praderas</span>
          </CardTitle>
          <CardDescription>Gestione los potreros, su estado y rotaciones.</CardDescription>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button size="sm" onClick={handleAddClick}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingPasture ? 'Editar Potrero' : 'Añadir Nuevo Potrero'}</DialogTitle>
                </DialogHeader>
                <PastureForm 
                  pasture={editingPasture}
                  onSave={handleSave}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingPasture(null);
                  }}
                />
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex-1">
        {pastures.length > 0 ? (
          <ul className="space-y-4">
            {pastures.map(pasture => (
              <li key={pasture.id} className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4">
                    <Leaf className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <p className="font-semibold">{pasture.name}</p>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                           <span>{pasture.area} ha</span>
                           <span className="text-xs">•</span>
                           <span>{pasture.grassType}</span>
                           <span className="text-xs">•</span>
                           <Badge variant={getStatusBadgeVariant(pasture.status)}>{pasture.status}</Badge>
                        </div>
                    </div>
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Opciones para {pasture.name}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(pasture)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Eliminar</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>¿Está seguro de eliminar?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción es permanente y eliminará el potrero "{pasture.name}" de sus registros. No se puede deshacer.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(pasture.id)}>
                                    Sí, eliminar
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>

              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p>No hay praderas registradas.</p>
            <Button variant="link" onClick={handleAddClick} className="mt-2">Añada su primer potrero</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
