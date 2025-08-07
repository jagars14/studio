'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestMatingHealthcare, SuggestMatingHealthcareOutput } from '@/ai/flows/suggest-mating-healthcare';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, HeartPulse, Sparkles, Loader2, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  animalData: z.string().min(50, "Por favor, proporcione datos más detallados de los animales para obtener mejores sugerencias."),
  environmentalConditions: z.string().min(20, "Por favor, proporcione condiciones ambientales más detalladas."),
});

type FormValues = z.infer<typeof formSchema>;

export default function OptimizerClient() {
  const [result, setResult] = useState<SuggestMatingHealthcareOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      animalData: "ID Animal: 101, Raza: Holstein, Edad: 3 años, Último Parto: 2023-01-15, Salud: Buena, Producción Leche: 25L/día. \nID Animal: 102, Raza: Angus, Edad: 2 años, Salud: Excelente, Peso: 580kg, Aún no ha parido.",
      environmentalConditions: "Ubicación: Valle Central, Temp: 28-35°C, Humedad: 75%, Pronóstico: Ola de calor esperada los próximos 5 días.",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const suggestions = await suggestMatingHealthcare(values);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl">Optimización con IA</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Proporcione datos completos sobre sus animales y las condiciones de la granja para recibir recomendaciones de apareamiento y cuidado de la salud impulsadas por IA. La IA considera factores como la raza, la salud y el estrés por calor para ofrecer consejos prácticos.
          </CardDescription>
        </CardContent>
      </Card>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
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
            <FormField
              control={form.control}
              name="environmentalConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Condiciones Ambientales</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ej., Temperatura, humedad, calidad del pasto, pronóstico del tiempo..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading} size="lg">
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
