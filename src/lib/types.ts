
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
  eventType: 'Celo' | 'Chequeo Preñez' | 'Fecha de Parto';
  date: Date;
};

export interface ColombiaData {
  [departamento: string]: string[];
}
