export type Animal = {
  id: string;
  name: string;
  breed: string;
  sex: 'Male' | 'Female';
  birthDate: string;
  fatherId: string | null;
  motherId: string | null;
  weight: number;
  photoUrl: string;
  status: 'Active' | 'Sold' | 'Deceased';
  category: 'Calf' | 'Heifer' | 'Bull' | 'Cow' | 'Steer';
};

export type Kpi = {
  title: string;
  value: string;
  change?: string;
  icon: React.ElementType;
};

export type ReproductiveEvent = {
  id: string;
  animalName: string;
  animalId: string;
  eventType: 'Heat' | 'Pregnancy Check' | 'Due Date';
  date: Date;
};
