
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInYears, differenceInMonths, differenceInDays, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Animal, ReproductiveEvent } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(birthDate: string): string {
  const now = new Date();
  const birth = new Date(birthDate);
  const years = differenceInYears(now, birth);
  const months = differenceInMonths(now, birth) % 12;
  
  if (years > 0) {
    return `${years} año${years > 1 ? 's' : ''}, ${months} mes${months > 1 ? 'es' : ''}`;
  }
  
  if (months > 0) {
      return `${months} mes${months > 1 ? 'es' : ''}`;
  }

  const days = differenceInDays(now, birth);
  return `${days} día${days > 1 ? 's' : ''}`;
}

// --- Reproductive Event Generation Logic ---

const PEV_DAYS = 50; // Período de Espera Voluntario
const CYCLE_DAYS = 21; // Ciclo Estral
const PREG_CHECK_DAYS = 35; // Chequeo de Preñez
const GESTATION_DAYS = 283; // Días de Gestación
const DRY_OFF_DAYS = 60; // Días para secado

export function generateReproductiveEvents(animals: Animal[]): ReproductiveEvent[] {
  const events: ReproductiveEvent[] = [];
  const femaleAnimals = animals.filter(a => a.sex === 'Hembra');

  femaleAnimals.forEach(animal => {
    // Caso 1: Basado en la fecha del último parto
    if (animal.lastCalvingDate) {
      const lastCalving = new Date(animal.lastCalvingDate);
      const pevEnd = addDays(lastCalving, PEV_DAYS);
      
      // Generar 3 fechas probables de celo post-parto
      for (let i = 0; i < 3; i++) {
        const heatDate = addDays(pevEnd, i * CYCLE_DAYS);
        events.push({
          id: `${animal.id}-heat-${i + 1}`,
          animalName: animal.name,
          animalId: animal.id,
          eventType: 'Próximo Celo',
          date: heatDate,
        });
      }
    }
    
    // Caso 2: Basado en la fecha del último celo/servicio
    if (animal.heatDate) {
      const serviceDate = new Date(animal.heatDate);
      
      const returnHeat = addDays(serviceDate, CYCLE_DAYS);
      events.push({
        id: `${animal.id}-return-heat`,
        animalName: animal.name,
        animalId: animal.id,
        eventType: 'Vigilar Retorno a Celo',
        date: returnHeat,
      });

      const pregCheck = addDays(serviceDate, PREG_CHECK_DAYS);
       events.push({
        id: `${animal.id}-preg-check`,
        animalName: animal.name,
        animalId: animal.id,
        eventType: 'Chequeo de Preñez',
        date: pregCheck,
      });
      
      // Si no hay fecha de preñez, asumimos que puede quedar preñada en esta fecha de servicio
      if (!animal.pregnancyDate) {
          const dueDate = addDays(serviceDate, GESTATION_DAYS);
          events.push({
            id: `${animal.id}-due-date-from-heat`,
            animalName: animal.name,
            animalId: animal.id,
            eventType: 'Fecha Probable de Parto',
            date: dueDate,
          });
      }
    }

    // Caso 3: Basado en la fecha de confirmación de preñez
    if (animal.pregnancyDate) {
      // Asumimos que la preñez se confirmó ~35 días post-servicio.
      const serviceDate = subDays(new Date(animal.pregnancyDate), PREG_CHECK_DAYS);
      
      const dryOffDate = addDays(serviceDate, GESTATION_DAYS - DRY_OFF_DAYS);
      events.push({
        id: `${animal.id}-dry-off`,
        animalName: animal.name,
        animalId: animal.id,
        eventType: 'Fecha de Secado',
        date: dryOffDate,
      });

      const dueDate = addDays(serviceDate, GESTATION_DAYS);
      events.push({
        id: `${animal.id}-due-date-from-preg`,
        animalName: animal.name,
        animalId: animal.id,
        eventType: 'Fecha Probable de Parto',
        date: dueDate,
      });
    }
  });

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}
