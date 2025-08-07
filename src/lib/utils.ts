import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(birthDate: string): string {
  const now = new Date();
  const birth = new Date(birthDate);
  const years = differenceInYears(now, birth);
  const months = differenceInMonths(now, birth) % 12;
  
  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
  }
  
  if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
  }

  const days = differenceInDays(now, birth);
  return `${days} day${days > 1 ? 's' : ''}`;
}
