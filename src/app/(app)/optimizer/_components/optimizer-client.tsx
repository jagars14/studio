'use client';

import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {z} from 'zod';
import {
  SuggestMatingHealthcareInputSchema,
  SuggestMatingHealthcareOutputSchema,
} from '@/ai/types'; // Corrected import path
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {
  BrainCircuit,
  HeartPulse,
  Sparkles,
  Loader2,
  ClipboardCheck,
  MapPin,
  Dna,
  CalendarDays,
  Syringe,
  AlertTriangle,
} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import Link from 'next/link';
import {auth, db} from '@/lib/firebase';
import {collection, query, where, getDocs} from 'firebase/firestore';
import type {Farm} from '@/lib/types';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Separator} from '@/components/ui/separator';

type FormValues = z.infer<typeof SuggestMatingHealthcareInputSchema>;
type OutputResult = z.infer<typeof SuggestMatingHealthcareOutputSchema>;

export default function OptimizerClient() {
  const [result, setResult] = useState<OutputResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const [user, loadingAuth] = useAuthState(auth);
  // Extend Farm with optional new fields for a smoother transition
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
      form.setValue(
        'productionSystem',
        farm.productionSystem || 'Pastoreo Rotacional con suplementación'
      );
      form.setValue(
        'geneticGoals',
        farm.geneticGoals || 'Aumentar sólidos en leche y mejorar salud de ubre'
      );
    }
  }, [farm, form]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/generate-suggestions', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch suggestions');
      }

      const suggestions: OutputResult = await response.json();
      setResult(suggestions);
    } catch (error: any) {
      console.error('AI Suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Could not generate AI suggestions: ${error.message}`,
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
              Optimizador de Hato con IA
            </CardTitle>
          </div>
          <CardDescription className="flex items-center gap-2 pt-2">
            <MapPin className="h-4 w-4" />
            <span>
              Generando sugerencias para la finca en{' '}
              <strong>{farmLocation}</strong>.{' '}
              <Link href="/settings" className="ml-1 text-primary hover:underline">
                Cambiar
              </Link>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Ingrese el perfil integral de un animal para recibir un plan de
            acción detallado. La IA actúa como un consultor experto, analizando
            datos reproductivos, de salud y productivos en el contexto de su
finca.
          </CardDescription>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Perfil del Animal</CardTitle>
              <CardDescription>
                Proporcione información detallada y precisa para obtener los
                mejores resultados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    Generando Plan de Acción...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Generar Plan de Acción
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {isLoading && (
        <div className="flex justify-center items-center pt-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">
            Analizando datos y consultando al experto...
          </p>
        </div>
      )}

      {result && (
        <div className="pt-8 space-y-8">
            <h2 className="text-2xl font-headline text-center">Plan de Acción Sugerido para ID: {form.getValues('animalId')}</h2>
            <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-6 w-6 text-primary" />
                  <CardTitle className="font-headline">
                    Estrategia de Apareamiento
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> Ventana Óptima de Servicio
                  </h3>
                  <p className="text-sm text-card-foreground pl-6">
                    <strong>
                      Días {result.matingStrategy.optimalServiceWindow.startDay} - {result.matingStrategy.optimalServiceWindow.endDay} post-parto.
                    </strong>
                  </p>
                  <p className="text-xs text-muted-foreground pl-6">{result.matingStrategy.optimalServiceWindow.justification}</p>
                </div>
                <Separator/>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Syringe className="h-4 w-4" /> Protocolo Pre-servicio
                  </h3>
                  <ul className="list-disc pl-10 text-sm space-y-1 mt-1">
                    {result.matingStrategy.preServiceProtocol.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
                 <Separator/>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Dna className="h-4 w-4" /> Recomendaciones Genéticas
                  </h3>
                   <p className="text-xs text-muted-foreground pl-6 mb-2">Objetivo Principal: {result.matingStrategy.geneticRecommendations.primaryGoal}</p>
                  <ul className="list-disc pl-10 text-sm space-y-1">
                    {result.matingStrategy.geneticRecommendations.suggestedSireTraits.map(
                      (rec, i) => (
                        <li key={i}>{rec}</li>
                      )
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card className="border-accent/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-6 w-6 text-accent" />
                  <CardTitle className="font-headline">
                    Plan Sanitario y Nutricional
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Calendario Preventivo (6 Meses)</h3>
                  <div className="space-y-2 mt-1">
                    {result.healthAndNutritionPlan.preventiveSchedule.map((item, i) => (
                      <div key={i} className="text-sm">
                        <strong className="block">{item.month}</strong>
                        <ul className="list-disc pl-6">
                          {item.actions.map((action, j) => <li key={j}>{action}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                 <Separator/>
                 <div>
                    <h3 className="font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500"/> Riesgos Regionales y Manejo</h3>
                    <p className="text-sm text-muted-foreground">{result.healthAndNutritionPlan.regionalRisksAndManagement}</p>
                 </div>
                 <Separator/>
                 <div>
                    <h3 className="font-semibold">Manejo Nutricional</h3>
                    <p className="text-sm text-muted-foreground">{result.healthAndNutritionPlan.nutritionalManagement}</p>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
