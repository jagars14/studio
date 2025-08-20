
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInYears, differenceInMonths, differenceInDays, addDays as dfnsAddDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Animal, ReproductiveEvent, MilkRecord, LactationAnalysis, HealthPlan, AnimalHealthEvent } from "./types";

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

// Helper para crear fechas en UTC y evitar errores de hidratación
export const createUTCDate = (dateString: string) => {
    // This format 'YYYY-MM-DD' is interpreted as UTC by default by new Date()
    // Adding 'T00:00:00' ensures it's treated as midnight UTC
    const date = new Date(`${dateString}T00:00:00Z`);
    return date;
};

const addUTCDays = (date: Date, days: number) => {
    const newDate = new Date(date.valueOf());
    newDate.setUTCDate(newDate.getUTCDate() + days);
    return newDate;
};

const subUTCDays = (date: Date, days: number) => {
    return addUTCDays(date, -days);
};

export function generateReproductiveEvents(
  animals: Animal[], 
  options?: { 
    includeBirthdays?: boolean;
    mode?: 'parto' | 'celo' | 'prenez';
    animalId?: string;
  }
): ReproductiveEvent[] {
  const events: ReproductiveEvent[] = [];
  const now = new Date();
  const currentUTCFullYear = now.getUTCFullYear();
  const includeBirthdays = options?.includeBirthdays ?? true;
  const { mode, animalId } = options || {};

  const targetAnimals = animalId ? animals.filter(a => a.id === animalId) : animals;

  targetAnimals.forEach(animal => {
    // --- Evento de Cumpleaños (para todos) ---
    if (includeBirthdays && animal.birthDate) {
        const birthDate = createUTCDate(animal.birthDate);
        let nextBirthday = new Date(Date.UTC(currentUTCFullYear, birthDate.getUTCMonth(), birthDate.getUTCDate()));
        
        if (nextBirthday.valueOf() < now.valueOf()) {
            nextBirthday.setUTCFullYear(currentUTCFullYear + 1);
        }

        events.push({
            id: `${animal.id}-birthday`,
            animalName: animal.name,
            animalId: animal.id,
            eventType: 'Cumpleaños',
            date: nextBirthday,
        });
    }

    // --- Eventos Reproductivos (solo hembras) ---
    if (animal.sex === 'Hembra') {
        if (!mode || mode === 'parto') {
            if (animal.lastCalvingDate) {
                const lastCalving = createUTCDate(animal.lastCalvingDate);
                const pevEnd = addUTCDays(lastCalving, PEV_DAYS);
                
                for (let i = 0; i < 3; i++) {
                    const heatDate = addUTCDays(pevEnd, i * CYCLE_DAYS);
                    events.push({
                        id: `${animal.id}-heat-${i + 1}`,
                        animalName: animal.name,
                        animalId: animal.id,
                        eventType: 'Próximo Celo',
                        date: heatDate,
                    });
                }
            }
        }
        
        if (!mode || mode === 'celo') {
            if (animal.heatDate) {
                const serviceDate = createUTCDate(animal.heatDate);
                
                events.push({
                    id: `${animal.id}-return-heat`,
                    animalName: animal.name,
                    animalId: animal.id,
                    eventType: 'Vigilar Retorno a Celo',
                    date: addUTCDays(serviceDate, CYCLE_DAYS),
                });

                events.push({
                    id: `${animal.id}-preg-check`,
                    animalName: animal.name,
                    animalId: animal.id,
                    eventType: 'Chequeo de Preñez',
                    date: addUTCDays(serviceDate, PREG_CHECK_DAYS),
                });
                
                if (!animal.pregnancyDate) {
                    const dueDate = addUTCDays(serviceDate, GESTATION_DAYS);
                    events.push({
                        id: `${animal.id}-due-date-from-heat`,
                        animalName: animal.name,
                        animalId: animal.id,
                        eventType: 'Fecha Probable de Parto',
                        date: dueDate,
                    });
                }
            }
        }

        if (!mode || mode === 'prenez') {
            if (animal.pregnancyDate) {
                const pregDate = createUTCDate(animal.pregnancyDate);
                // Asumimos que la fecha de preñez es X días después del servicio
                const serviceDate = subUTCDays(pregDate, PREG_CHECK_DAYS); 
                
                events.push({
                    id: `${animal.id}-dry-off`,
                    animalName: animal.name,
                    animalId: animal.id,
                    eventType: 'Fecha de Secado',
                    date: addUTCDays(serviceDate, GESTATION_DAYS - DRY_OFF_DAYS),
                });

                events.push({
                    id: `${animal.id}-due-date-from-preg`,
                    animalName: animal.name,
                    animalId: animal.id,
                    eventType: 'Fecha Probable de Parto',
                    date: addUTCDays(serviceDate, GESTATION_DAYS),
                });
            }
        }
    }
  });

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function generateHealthEvents(animal: Animal, plan: HealthPlan): AnimalHealthEvent[] {
  if (!animal.birthDate) return [];

  const birthDate = createUTCDate(animal.birthDate);
  
  return plan.events.map(event => {
    const eventDate = addUTCDays(birthDate, event.daysFromBirth);
    if (isNaN(eventDate.getTime())) {
        return null;
    }
    return {
        id: `${animal.id}-${event.name.toLowerCase().replace(/\s/g, '-')}`,
        animalId: animal.id,
        animalName: animal.name,
        eventName: event.name,
        date: eventDate,
    }
  }).filter((event): event is AnimalHealthEvent => event !== null);
}


export function analyzeLactation(animal: Animal, records: MilkRecord[]): LactationAnalysis | null {
  if (!animal.lastCalvingDate) return null;

  const lastCalvingDate = createUTCDate(animal.lastCalvingDate);
  const animalRecords = records
    .filter(r => r.animalId === animal.id && createUTCDate(r.date) >= lastCalvingDate)
    .sort((a, b) => createUTCDate(a.date).getTime() - createUTCDate(b.date).getTime());

  if (animalRecords.length === 0) return null;

  const dailyProduction: { [key: number]: number } = {};
  animalRecords.forEach(record => {
    const recordDate = createUTCDate(record.date);
    const del = differenceInDays(recordDate, lastCalvingDate);
    if (del >= 0) {
      dailyProduction[del] = (dailyProduction[del] || 0) + record.quantity;
    }
  });
  
  const data = Object.entries(dailyProduction).map(([del, production]) => ({
    del: parseInt(del, 10),
    production,
  })).sort((a,b) => a.del - b.del);

  if (data.length === 0) return null;

  const peakProduction = Math.max(...data.map(d => d.production));
  const totalProduction = data.reduce((sum, d) => sum + d.production, 0);

  // Simple projection: average production so far * 305
  const averageProduction = totalProduction / data.length;
  const projected305DayProduction = averageProduction * 305;
  
  // Simple persistency: (last 10 days avg / peak) * 100
  const last10DaysData = data.slice(-10);
  const last10DaysAvg = last10DaysData.reduce((sum, d) => sum + d.production, 0) / last10DaysData.length;
  const persistency = peakProduction > 0 ? (last10DaysAvg / peakProduction) * 100 : 0;

  return {
    data,
    peakProduction,
    totalProduction,
    projected305DayProduction,
    persistency,
  };
}
