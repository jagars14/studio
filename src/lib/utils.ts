import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

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
