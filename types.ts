
export enum CarType {
  CLASSIC_4X4 = 'Classic 4x4',
  MUSCLE = 'Muscle',
  VINTAGE_SPORT = 'Vintage Sport',
  MODERN_CLASSIC = 'Modern Classic',
  TRUCK = 'Truck',
  WAGON = 'Wagon'
}

export interface CarSpecs {
  horsepower: number;
  topSpeedMph: number;
  zeroToSixty: number; // seconds
  engine: string;
  mpgCity?: number;
  mpgHwy?: number;
  mileage: number;
}

export interface Car {
  id: string;
  dbId?: number;
  make: string;
  model: string;
  year: number;
  price: number;
  type: string; 
  images: string[]; 
  description: string;
  specs: CarSpecs;
  features: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface HeroSlide {
  id: string;
  carId?: number | null;
  selectedImageIndex?: number;
  image: string;
  title: string;
  subtitle: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    estYear: string;
    slides?: HeroSlide[];
  };
  services: {
    title: string;
    description: string;
  };
  contact: {
    address: string;
    phone1: string;
    phone2: string;
    email: string;
    openingHoursWeek: string;
    openingHoursSat: string;
  };
}