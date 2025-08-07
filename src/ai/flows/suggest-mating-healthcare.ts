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
  department: z.string().describe('El departamento de Colombia donde se encuentra la granja.'),
  city: z.string().describe('La ciudad o municipio de Colombia donde se encuentra la granja.'),
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
  prompt: `Eres un asistente de IA experto en ganadería y veterinaria, que proporciona sugerencias para calendarios de apareamiento y cuidado de la salud para una granja de ganado.

La granja está ubicada en la ciudad de {{{city}}}, en el departamento de {{{department}}}, Colombia. Utiliza esta ubicación para inferir las condiciones ambientales típicas (temperatura, humedad, estacionalidad) de la región.

Analiza los siguientes datos de los animales:
{{{animalData}}}

Basándote en los datos de los animales y las condiciones ambientales inferidas de la ubicación, proporciona:
1.  **Calendarios de apareamiento óptimos:** Considera ciclos de celo, salud, y especialmente las condiciones ambientales para maximizar la fertilidad.
2.  **Recomendaciones de cuidado de la salud:** Incluye alertas de estrés por calor, recomendaciones de vacunación y desparasitación pertinentes para la región, y otros chequeos necesarios. Sé conciso y práctico.
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
