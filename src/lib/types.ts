

export type Animal = {
  id: string;
  name: string;
  breed: 'Holstein' | 'Angus' | 'Brahman' | 'Jersey' | 'Gyr' | 'Normando';
  sex: 'Macho' | 'Hembra';
  birthDate: string;
  fatherId: string | null;
  motherId: string | null;
  weight: number;
  status: 'Activo' | 'Vendido' | 'Fallecido';
  category: 'Vaca' | 'Novilla' | 'Toro' | 'Ternero' | 'Ternera' | 'Novillo';
  productionStatus?: 'En Producción' | 'Seca';
  lastCalvingDate?: string;
  heatDate?: string;
  pregnancyDate?: string;
  assignedRation?: string;
  rationAmount?: number;
};

export type Kpi = {
  title: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  href: string;
};

export type ReproductiveEvent = {
  id: string;
  animalName: string;
  animalId: string;
  eventType: 
    | 'Próximo Celo' 
    | 'Vigilar Retorno a Celo'
    | 'Chequeo de Preñez' 
    | 'Fecha de Secado'
    | 'Fecha Probable de Parto'
    | 'Cumpleaños';
  date: Date;
};

export interface ColombiaData {
  [departamento: string]: string[];
}

export type User = {
    uid: string;
    email: string | null;
    name: string | null;
};

export type Farm = {
    id?: string;
    name: string;
    ownerId: string;
    department: string;
    city: string;
}

export type MilkRecord = {
  id: string;
  animalId: string;
  animalName: string;
  date: string;
  session: 'AM' | 'PM' | 'Único';
  quantity: number; // en litros
};

export type Ration = {
  id: string;
  name: string;
  description: string;
  suggestionRule: (animal: Animal) => boolean;
};

export type LactationDataPoint = {
  del: number; // Días en Leche
  production: number;
};

export type LactationAnalysis = {
  data: LactationDataPoint[];
  peakProduction: number;
  totalProduction: number;
  projected305DayProduction: number;
  persistency: number;
};
