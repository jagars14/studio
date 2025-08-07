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
  animalData: z.string().describe('Comprehensive data for each animal in the farm, including breed, age, reproductive history, and health records.'),
  environmentalConditions: z.string().describe('Current environmental conditions of the farm, including temperature, humidity, and historical weather data.'),
});
export type SuggestMatingHealthcareInput = z.infer<typeof SuggestMatingHealthcareInputSchema>;

const SuggestMatingHealthcareOutputSchema = z.object({
  matingSuggestions: z.string().describe('Optimal mating schedules for each animal, considering factors like estrus cycles, health, and environmental conditions.'),
  healthcareSuggestions: z.string().describe('Recommended healthcare actions for each animal, including vaccinations, check-ups, and heat stress alerts.'),
});
export type SuggestMatingHealthcareOutput = z.infer<typeof SuggestMatingHealthcareOutputSchema>;

export async function suggestMatingHealthcare(input: SuggestMatingHealthcareInput): Promise<SuggestMatingHealthcareOutput> {
  return suggestMatingHealthcareFlow(input);
}

const suggestMatingHealthcarePrompt = ai.definePrompt({
  name: 'suggestMatingHealthcarePrompt',
  input: {schema: SuggestMatingHealthcareInputSchema},
  output: {schema: SuggestMatingHealthcareOutputSchema},
  prompt: `You are an AI assistant providing suggestions for mating schedules and healthcare for a cattle farm, considering animal data and environmental conditions.

Analyze the following animal data:
{{{animalData}}}

And consider these environmental conditions:
{{{environmentalConditions}}}

Provide optimal mating schedules and healthcare recommendations, including heat stress alerts to minimize risks during heatwaves, considering breed-specific tolerances. Be concise.
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
