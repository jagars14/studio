
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestMatingHealthcare, SuggestMatingHealthcareOutput } from '@/ai/flows/suggest-mating-healthcare';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, HeartPulse, Sparkles, Loader2, ClipboardCheck, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Farm } from '@/lib/types';
import { useAuthState } from 'react-firebase-hooks/auth';

const formSchema = z.object({
  animalData: z.string().min(50, "Por favor, proporcione datos más detallados de los animales para obtener mejores sugerencias."),
});

type FormValues = z.infer<typeof formSchema>;

export default function OptimizerClient() {
  const [result, setResult] = useState<SuggestMatingHealthcareOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [user, loadingAuth] = useAuthState(auth);
  const [farm, setFarm] = useState<Farm | null>(null);

  useEffect(() => {
    async function fetchFarmData() {
      if (user) {
        const q = query(collection(db, 'farms'), where('ownerId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const farmDoc = querySnapshot.docs[0];
          setFarm(farmDoc.data() as Farm);
        }
      }
    }
    fetchFarmData();
  }, [user]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      animalData: "ID Animal: 101, Raza: Holstein, Edad: 3 años, Último Parto: 2023-01-15, Salud: Buena, Producción Leche: 25L/día. \nID Animal: 102, Raza: Angus, Edad: 2 años, Salud: Excelente, Peso: 580kg, Aún no ha parido.",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!farm) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se ha configurado la ubicación de la finca. Por favor, configúrela en los ajustes.",
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    try {
      const suggestions = await suggestMatingHealthcare({
        animalData: values.animalData,
        department: farm.department,
        city: farm.city,
      });
      setResult(suggestions);
    } catch (error) {
      console.error("Falló la sugerencia de IA:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron generar las sugerencias de IA. Por favor, inténtelo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const farmLocation = farm ? `${farm.city}, ${farm.department}` : 'Ubicación no configurada';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl">Optimización con IA</CardTitle>
          </div>
           <CardDescription className="flex items-center gap-2 pt-2">
            <MapPin className="h-4 w-4" />
            <span>
              Generando sugerencias para la finca en <strong>{farmLocation}</strong>. 
              <Link href="/settings" className="ml-1 text-primary hover:underline">Cambiar ubicación</Link>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Proporcione datos completos sobre sus animales para recibir recomendaciones de apareamiento y cuidado de la salud impulsadas por IA. La IA considera factores como la raza, la salud y las condiciones climáticas de su ubicación para ofrecer consejos prácticos.
          </CardDescription>
        </CardContent>
      </Card>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           <FormField
              control={form.control}
              name="animalData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Datos de los Animales</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ej., ID del animal, raza, edad, registros de salud, historial reproductivo..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button type="submit" disabled={isLoading || !farm || loadingAuth} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Generar Sugerencias
              </>
            )}
          </Button>
        </form>
      </Form>

      {isLoading && (
         <div className="flex justify-center items-center pt-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
         </div>
      )}

      {result && (
        <div className="grid md:grid-cols-2 gap-8 pt-8">
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <HeartPulse className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline">Sugerencias de Apareamiento</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-card-foreground whitespace-pre-line">{result.matingSuggestions}</p>
            </CardContent>
          </Card>
          <Card className="border-accent">
            <CardHeader>
              <div className="flex items-center gap-2">
                 <ClipboardCheck className="h-6 w-6 text-accent" />
                <CardTitle className="font-headline">Sugerencias de Cuidado</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-card-foreground whitespace-pre-line">{result.healthcareSuggestions}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
