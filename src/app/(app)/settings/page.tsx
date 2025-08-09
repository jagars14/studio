
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { colombiaData } from '@/lib/colombia-data';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import type { Farm } from '@/lib/types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [user, loadingAuth] = useAuthState(auth);

  const [farm, setFarm] = useState<Farm | null>(null);
  const [farmId, setFarmId] = useState<string | null>(null);
  const [farmName, setFarmName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchFarmData() {
      if (user) {
        try {
          const q = query(collection(db, 'farms'), where('ownerId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const farmDoc = querySnapshot.docs[0];
            const farmData = farmDoc.data() as Farm;
            setFarm(farmData);
            setFarmId(farmDoc.id);
            setFarmName(farmData.name);
            
            const initialDepartment = farmData.department || 'Antioquia';
            const initialCity = farmData.city || 'Medellín';
            
            setSelectedDepartment(initialDepartment);
            setCities(colombiaData[initialDepartment] || []);
            setSelectedCity(initialCity);
          }
        } catch (error) {
          console.error("Error fetching farm data:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudieron cargar los datos de la finca.",
          });
        } finally {
          setIsLoading(false);
        }
      } else if (!loadingAuth) {
         setIsLoading(false);
      }
    }

    fetchFarmData();
  }, [user, loadingAuth, toast]);


  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    const departmentCities = colombiaData[department] || [];
    setCities(departmentCities);
    setSelectedCity(departmentCities[0] || '');
  };

  const handleSaveChanges = async () => {
    if (!farmId) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No se encontró la finca para actualizar.",
        });
        return;
    }

    setIsSaving(true);
    try {
        const farmDocRef = doc(db, 'farms', farmId);
        await updateDoc(farmDocRef, {
            name: farmName,
            department: selectedDepartment,
            city: selectedCity,
        });

        toast({
            title: "Configuración Guardada",
            description: `Tu finca ha sido actualizada a ${selectedCity}, ${selectedDepartment}.`,
        });
    } catch (error) {
        console.error("Error updating farm data:", error);
        toast({
            variant: "destructive",
            title: "Error al Guardar",
            description: "No se pudieron guardar los cambios. Inténtelo de nuevo.",
        });
    } finally {
        setIsSaving(false);
    }
  };

  const departments = Object.keys(colombiaData);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-9 w-48" />
        <Card>
          <CardHeader>
             <Skeleton className="h-6 w-40" />
             <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
             </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

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
            <Input 
              id="farm-name" 
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select onValueChange={handleDepartmentChange} value={selectedDepartment} disabled={isSaving}>
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
              <Select value={selectedCity} onValueChange={setSelectedCity} disabled={isSaving}>
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
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
