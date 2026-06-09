export interface Car {
  id: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  fuel: 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
  transmission: 'Manual' | 'Automatic';
  km: number;
  price: number; // in Lakhs (e.g., 5.45)
  emi: number; // monthly estimate in INR
  city: string;
  owner: '1st Owner' | '2nd Owner' | '3rd Owner';
  registrationYear: number;
  insuranceStatus: 'Comprehensive' | 'Third Party' | 'Expired';
  serviceHistory: 'Full Dealership History' | 'Partial History' | 'No History';
  inspectionScore: number; // out of 100
  images: string[];
  specifications: {
    engine: string;
    mileage: string;
    maxPower: string;
    seats: number;
    color: string;
  };
  overview: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string; // URL or emoji-based logo icon
}

export interface City {
  id: string;
  name: string;
  slug: string;
  popular: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  carModel: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Lead {
  id: string;
  type: 'buy' | 'sell' | 'service';
  name: string;
  phone: string;
  email: string;
  city: string;
  timestamp: string;
  details: {
    carId?: string;
    brand?: string;
    model?: string;
    variant?: string;
    year?: number;
    fuel?: string;
    transmission?: string;
    km?: number;
    expectedPrice?: number;
    condition?: string;
    serviceType?: string;
    bookingDate?: string;
    bookingTime?: string;
    address?: string;
    notes?: string;
  };
}
