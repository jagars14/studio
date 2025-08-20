import {z} from 'zod';

// This file contains shared Zod schemas used by both the Genkit flow (server-side)
// and the React components (client-side). By keeping them separate, we avoid
// bundling server-side dependencies into the client application.

export const SuggestMatingHealthcareInputSchema = z.object({
  animalId: z.string(),
  breed: z.string(),
  birthDate: z.string(),
  parturitions: z.number(),
  daysInMilk: z.number(),
  milkProduction: z.number(),
  fatPercentage: z.number().optional(),
  proteinPercentage: z.number().optional(),
  bodyCondition: z.number(),
  previousSire: z.string().optional(),
  healthHistory: z.string(),
  reproductiveHistory: z.string(),
  herd: z.string(),
  city: z.string(),
  department: z.string(),
  altitude: z.number(),
  productionSystem: z.string(),
  geneticGoals: z.string(),
});

export const SuggestMatingHealthcareOutputSchema = z.object({
  matingStrategy: z.object({
    optimalServiceWindow: z.object({
      startDay: z.number(),
      endDay: z.number(),
      justification: z.string(),
    }),
    preServiceProtocol: z.array(z.string()),
    geneticRecommendations: z.object({
      primaryGoal: z.string(),
      suggestedSireTraits: z.array(z.string()),
    }),
  }),
  healthAndNutritionPlan: z.object({
    preventiveSchedule: z.array(
      z.object({
        month: z.string(),
        actions: z.array(z.string()),
      })
    ),
    regionalRisksAndManagement: z.string(),
    nutritionalManagement: z.string(),
  }),
});
