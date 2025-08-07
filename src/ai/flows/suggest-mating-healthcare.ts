// src/ai/flows/suggest-mating-healthcare.ts
'use server';

/**
 * @fileOverview AI-powered suggestions for mating schedules and healthcare.
 *
 * - suggestMatingHealthcare - A function that provides suggestions for mating schedules and healthcare based on animal data and environmental conditions.
 * - SuggestMatingHealthcareInput - The input type for the suggestMatingHealthcare function.
 * - SuggestMatingHealthcareOutput - The return type for the suggestMatingHealthcare function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMatingHealthcareInputSchema = z.object({
  animalData: z.string().describe('Datos completos de cada animal en la granja, incluyendo raza, edad, historial reproductivo y registros de salud.'),
  environmentalConditions: z.string().describe('Condiciones ambientales actuales de la granja, incluyendo temperatura, humedad y datos meteorológicos históricos.'),
});
export type SuggestMatingHealthcareInput = z.infer<typeof SuggestMatingHealthcareInputSchema>;

const SuggestMatingHealthcareOutputSchema = z.object({
  matingSuggestions: z.string().describe('Calendarios de apareamiento óptimos para cada animal, considerando factores como ciclos de celo, salud y condiciones ambientales.'),
  healthcareSuggestions: z.string().describe('Acciones de cuidado de la salud recomendadas para cada animal, incluyendo vacunas, chequeos y alertas de estrés por calor.'),
});
export type SuggestMatingHealthcareOutput = z.infer<typeof SuggestMatingHealthcareOutputSchema>;

export async function suggestMatingHealthcare(input: SuggestMatingHealthcareInput): Promise<SuggestMatingHealthcareOutput> {
  return suggestMatingHealthcareFlow(input);
}

const suggestMatingHealthcarePrompt = ai.definePrompt({
  name: 'suggestMatingHealthcarePrompt',
  input: {schema: SuggestMatingHealthcareInputSchema},
  output: {schema: SuggestMatingHealthcareOutputSchema},
  prompt: `Eres un asistente de IA que proporciona sugerencias para calendarios de apareamiento y cuidado de la salud para una granja de ganado, considerando datos de los animales y condiciones ambientales.

Analiza los siguientes datos de los animales:
{{{animalData}}}

Y considera estas condiciones ambientales:
{{{environmentalConditions}}}

Proporciona calendarios de apareamiento óptimos y recomendaciones de cuidado de la salud, incluyendo alertas de estrés por calor para minimizar los riesgos durante las olas de calor, considerando las tolerancias específicas de cada raza. Sé conciso.
`,
});

const suggestMatingHealthcareFlow = ai.defineFlow(
  {
    name: 'suggestMatingHealthcareFlow',
    inputSchema: SuggestMatingHealthcareInputSchema,
    outputSchema: SuggestMatingHealthcareOutputSchema,
  },
  async input => {
    const {output} = await suggestMatingHealthcarePrompt(input);
    return output!;
  }
);
