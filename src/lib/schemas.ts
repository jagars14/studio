import {z} from 'zod';

// Zod schema for validating the animal profile form.
// This is used by the form in the OptimizerClient component.
export const SuggestMatingHealthcareInputSchema = z.object({
  animalId: z.string().min(1, 'El ID del animal es requerido.'),
  breed: z.string().min(1, 'La raza es requerida.'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es requerida.'),
  parturitions: z.number().min(0, 'El número de partos no puede ser negativo.'),
  daysInMilk: z.number().min(0, 'Los días en leche no pueden ser negativos.'),
  milkProduction: z.number().min(0, 'La producción de leche no puede ser negativa.'),
  bodyCondition: z.number().min(1, 'La condición corporal debe ser al menos 1.').max(5, 'La condición corporal no puede ser mayor a 5.'),
  healthHistory: z.string().optional(),
  reproductiveHistory: z.string().optional(),
  herd: z.string().optional(),
  city: z.string().min(1, 'La ciudad es requerida.'),
  department: z.string().min(1, 'El departamento es requerido.'),
  altitude: z.number().min(0, 'La altitud no puede ser negativa.'),
  // These fields are no longer used by the IA but are kept for form validation schema consistency.
  productionSystem: z.string().optional(),
  geneticGoals: z.string().optional(),
});
