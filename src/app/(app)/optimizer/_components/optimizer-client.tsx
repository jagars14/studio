'use client';

import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {z} from 'zod';
import {SuggestMatingHealthcareInputSchema} from '@/lib/schemas';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {
  Sparkles,
  Loader2,
  MapPin,
  BrainCircuit,
  MessageSquareQuote,
} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import Link from 'next/link';
import {auth, db} from '@/lib/firebase';
import {collection, query, where, getDocs} from 'firebase/firestore';
import type {Farm} from '@/lib/types';
import {useAuthState} from 'react-firebase-hooks/auth';

type FormValues = z.infer<typeof SuggestMatingHealthcareInputSchema>;

const API_PROXY_URL = '/api/send-webhook';

export default function OptimizerClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [expertResponse, setExpertResponse] = useState<string | null>(null);
  const {toast} = useToast();
  const [user, loadingAuth] = useAuthState(auth);
  const [farm, setFarm] = useState<
    Farm & {altitude?: number; productionSystem?: string; geneticGoals?: string}
  | null
  >(null);

  useEffect(() => {
    async function fetchFarmData() {
      if (user) {
        const q = query(
          collection(db, 'farms'),
          where('ownerId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const farmDoc = querySnapshot.docs[0];
          setFarm(
            farmDoc.data() as Farm & {
              altitude?: number;
              productionSystem?: string;
              geneticGoals?: string;
            }
          );
        }
      }
    }
    fetchFarmData();
  }, [user]);

  const form = useForm<FormValues>({
    resolver: zodResolver(SuggestMatingHealthcareInputSchema),
    defaultValues: {
      animalId: 'BOV-001',
      breed: 'Holstein 75%, Pardo Suizo 25%',
      birthDate: '2021-05-20',
      parturitions: 2,
      daysInMilk: 80,
      milkProduction: 30,
      bodyCondition: 3.5,
      healthHistory:
        'Sin problemas de salud significativos en esta lactancia. Tuvo un caso leve de mastitis en la lactancia anterior.',
      reproductiveHistory:
        'Inseminada dos veces en la lactancia anterior. Primer servicio a los 65 DEL.',
      herd: 'Lote de alta producción',
      city: '',
      department: '',
      altitude: 0,
      productionSystem: '',
      geneticGoals: '',
    },
  });

  useEffect(() => {
    if (farm) {
      form.setValue('city', farm.city);
      form.setValue('department', farm.department);
      form.setValue('altitude', farm.altitude || 1500);
    }
  }, [farm, form]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setExpertResponse(null);

    const payload = {
      animalId: values.animalId,
      breed: values.breed,
      birthDate: values.birthDate,
      parturitions: values.parturitions,
      daysInMilk: values.daysInMilk,
      milkProduction: values.milkProduction,
      bodyCondition: values.bodyCondition,
      healthHistory: values.healthHistory,
      reproductiveHistory: values.reproductiveHistory,
      city: values.city,
      department: values.department,
      altitude: values.altitude,
    };

    try {
      const response = await fetch(API_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('La respuesta del servidor no fue exitosa.');
      }
      
      const responseData = await response.json();
      
      if (responseData && responseData.output) {
        setExpertResponse(responseData.output);
        toast({
          title: 'Respuesta Recibida',
          description: 'El experto ha enviado una recomendación.',
        });
      } else {
         throw new Error("La respuesta no contenía el formato esperado.");
      }
      
    } catch (error) {
      console.error('Failed to send data via proxy:', error);
      toast({
        variant: 'destructive',
        title: 'Error en la Consulta',
        description: 'No se pudo obtener una respuesta del experto. Por favor, intente de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const farmLocation = farm
    ? `${farm.city}, ${farm.department}`
    : 'Ubicación no configurada';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl">
              Asistente Experto
            </CardTitle>
          </div>
          <CardDescription className="flex items-center gap-2 pt-2">
            <MapPin className="h-4 w-4" />
            <span>
              Enviando consulta desde la finca en{' '}
              <strong>{farmLocation}</strong>.{' '}
              <Link href="/settings" className="ml-1 text-primary hover:underline">
                Cambiar
              </Link>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Ingrese el perfil integral de un animal para enviar sus datos a un experto y recibir recomendaciones personalizadas.
          </CardDescription>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Perfil del Animal</CardTitle>
              <CardDescription>
                Proporcione la información detallada para la consulta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Form fields remain the same */}
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="animalId"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>ID del Animal</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: BOV-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="breed"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Raza y Genética</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Holstein 75%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="parturitions"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel># de Partos</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="daysInMilk"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Días en Leche (DEL)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="milkProduction"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Producción (L/día)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={e =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bodyCondition"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Condición Corporal (1-5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={e =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="healthHistory"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Historial de Salud</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Eventos de salud relevantes..."
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reproductiveHistory"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Historial Reproductivo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Servicios, diagnósticos, problemas..."
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || !farm || loadingAuth} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Consultando al Experto...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Consulta al Experto
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      
      {isLoading && (
         <div className="flex justify-center items-center pt-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
             <p className="ml-4 text-muted-foreground">Esperando respuesta del experto...</p>
         </div>
      )}

      {expertResponse && (
        <Card className="mt-8 border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareQuote className="h-6 w-6 text-primary"/>
              Respuesta del Experto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground whitespace-pre-line">{expertResponse}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
