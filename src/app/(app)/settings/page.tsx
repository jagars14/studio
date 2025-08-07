
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { colombiaData } from '@/lib/colombia-data';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [selectedDepartment, setSelectedDepartment] = useState('Antioquia');
  const [cities, setCities] = useState<string[]>(colombiaData['Antioquia'] || []);
  const [selectedCity, setSelectedCity] = useState('Medellín');

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    const departmentCities = colombiaData[department] || [];
    setCities(departmentCities);
    setSelectedCity(departmentCities[0] || '');
  };

  const handleSaveChanges = () => {
    // En una aplicación real, aquí guardarías los datos en el backend.
    // Por ahora, solo mostramos una notificación.
    toast({
      title: "Configuración Guardada",
      description: `Tu finca ha sido actualizada a ${selectedCity}, ${selectedDepartment}.`,
    });
  };

  const departments = Object.keys(colombiaData);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-headline font-bold">Configuración</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Finca</CardTitle>
          <CardDescription>Actualiza el nombre y la ubicación de tu finca.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="farm-name">Nombre de la Finca</Label>
            <Input id="farm-name" defaultValue="Finca Demo BovinoPro" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select onValueChange={handleDepartmentChange} defaultValue={selectedDepartment}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Selecciona un departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger id="city">
                  <SelectValue placeholder="Selecciona una ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
