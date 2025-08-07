export type Animal = {
  id: string;
  name: string;
  breed: string;
  sex: 'Macho' | 'Hembra';
  birthDate: string;
  fatherId: string | null;
  motherId: string | null;
  weight: number;
  photoUrl: string;
  status: 'Activo' | 'Vendido' | 'Fallecido';
  category: 'Ternero' | 'Novilla' | 'Toro' | 'Vaca' | 'Novillo';
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
