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
  animalData: z.string().min(50, "Please provide more detailed animal data for better suggestions."),
  environmentalConditions: z.string().min(20, "Please provide more detailed environmental conditions."),
});

type FormValues = z.infer<typeof formSchema>;

export default function OptimizerClient() {
  const [result, setResult] = useState<SuggestMatingHealthcareOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      animalData: "Animal ID: 101, Breed: Holstein, Age: 3 years, Last Calving: 2023-01-15, Health: Good, Milk Yield: 25L/day. \nAnimal ID: 102, Breed: Angus, Age: 2 years, Health: Excellent, Weight: 580kg, Not yet bred.",
      environmentalConditions: "Location: Central Valley, Temp: 28-35°C, Humidity: 75%, Forecast: Heatwave expected next 5 days.",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const suggestions = await suggestMatingHealthcare(values);
      setResult(suggestions);
    } catch (error) {
      console.error("AI suggestion failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate AI suggestions. Please try again.",
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
            <CardTitle className="font-headline text-2xl">AI-Powered Optimization</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Provide comprehensive data about your animals and farm conditions to receive AI-powered recommendations for mating and healthcare. The AI considers factors like breed, health, and heat stress to provide actionable advice.
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
                  <FormLabel className="text-lg">Animal Data</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Animal ID, breed, age, health records, reproductive history..."
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
                  <FormLabel className="text-lg">Environmental Conditions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Temperature, humidity, pasture quality, weather forecast..."
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
                Generating...
              </>
            ) : (
              <>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Generate Suggestions
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
                <CardTitle className="font-headline">Mating Suggestions</CardTitle>
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
                <CardTitle className="font-headline">Healthcare Suggestions</CardTitle>
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
