
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
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import type { Farm, HealthPlan } from '@/lib/types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, PlusCircle, Trash2, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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

  // State for Health Plans
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>([]);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanEvents, setNewPlanEvents] = useState<{ name: string; daysFromBirth: number; }[]>([{ name: '', daysFromBirth: 0 }]);

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

  const handlePlanEventChange = (index: number, field: 'name' | 'daysFromBirth', value: string) => {
    const updatedEvents = [...newPlanEvents];
    if (field === 'daysFromBirth') {
      updatedEvents[index][field] = parseInt(value, 10) || 0;
    } else {
      updatedEvents[index][field] = value;
    }
    setNewPlanEvents(updatedEvents);
  };

  const addPlanEvent = () => {
    setNewPlanEvents([...newPlanEvents, { name: '', daysFromBirth: 0 }]);
  };

  const removePlanEvent = (index: number) => {
    setNewPlanEvents(newPlanEvents.filter((_, i) => i !== index));
  };
  
  const handleSavePlan = async () => {
     // In a real app, this would save to Firestore. For now, we just log it.
    console.log("Nuevo Plan a Guardar:", { name: newPlanName, events: newPlanEvents });
     toast({
        title: "Plan Guardado (Simulación)",
        description: `El plan "${newPlanName}" ha sido guardado.`,
    });
    setNewPlanName('');
    setNewPlanEvents([{ name: '', daysFromBirth: 0 }]);
  }

  const departments = Object.keys(colombiaData);

  if (isLoading) {
    return (
       <div className="space-y-6">
            <h1 className="text-3xl font-headline font-bold">Configuración</h1>
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
    <div className="space-y-6">
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
            Guardar Cambios de Finca
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Planes de Crianza y Sanidad</CardTitle>
            <CardDescription>Define plantillas de eventos para estandarizar el manejo de terneras.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2">Planes Existentes</h3>
                <p className="text-sm text-muted-foreground">Actualmente esta es una lista estática. La gestión de planes se añadirá en el futuro.</p>
                {/* List of existing plans would go here */}
            </div>
            <Separator />
            <div>
                <h3 className="font-semibold mb-4">Crear Nuevo Plan</h3>
                 <div className="space-y-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                        <Label htmlFor="plan-name">Nombre del Plan</Label>
                        <Input id="plan-name" placeholder="Ej: Plan de Levante Estándar" value={newPlanName} onChange={e => setNewPlanName(e.target.value)} />
                    </div>
                    {newPlanEvents.map((event, index) => (
                        <div key={index} className="flex items-end gap-2">
                            <div className="grid gap-2 flex-1">
                                <Label htmlFor={`event-name-${index}`}>Nombre del Evento</Label>
                                <Input id={`event-name-${index}`} value={event.name} onChange={e => handlePlanEventChange(index, 'name', e.target.value)} placeholder="Ej: Primera Vacuna" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`event-days-${index}`}>Días Post-Nacimiento</Label>
                                <Input id={`event-days-${index}`} type="number" value={event.daysFromBirth} onChange={e => handlePlanEventChange(index, 'daysFromBirth', e.target.value)} className="w-24" />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removePlanEvent(index)} disabled={newPlanEvents.length <= 1}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                     <Button variant="outline" size="sm" onClick={addPlanEvent}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Evento
                    </Button>
                 </div>
            </div>
        </CardContent>
         <CardFooter className="border-t pt-6">
          <Button onClick={handleSavePlan}>
            Guardar Nuevo Plan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
