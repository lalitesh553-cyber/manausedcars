import { Car, Brand, City, Testimonial, FAQ } from './types';

export const BRANDS: Brand[] = [
  { id: 'maruti', name: 'Maruti Suzuki', logo: '🚗' },
  { id: 'hyundai', name: 'Hyundai', logo: '🚘' },
  { id: 'tata', name: 'Tata', logo: '🦁' },
  { id: 'honda', name: 'Honda', logo: '🏎️' },
  { id: 'mahindra', name: 'Mahindra', logo: '⛰️' },
  { id: 'toyota', name: 'Toyota', logo: '🛡️' },
  { id: 'kia', name: 'Kia', logo: '⭐' },
  { id: 'mg', name: 'MG', logo: '🇬🇧' },
  { id: 'skoda', name: 'Skoda', logo: '🏹' },
  { id: 'volkswagen', name: 'Volkswagen', logo: '🇩🇪' }
];

export const CITIES: City[] = [
  { id: 'bangalore', name: 'Bangalore', slug: 'bangalore', popular: true },
  { id: 'hyderabad', name: 'Hyderabad', slug: 'hyderabad', popular: true },
  { id: 'chennai', name: 'Chennai', slug: 'chennai', popular: true },
  { id: 'kochi', name: 'Kochi', slug: 'kochi', popular: true },
  { id: 'coimbatore', name: 'Coimbatore', slug: 'coimbatore', popular: true },
  { id: 'visakhapatnam', name: 'Visakhapatnam', slug: 'visakhapatnam', popular: true }
];

export const CARS: Car[] = [
  {
    id: 'maruti-baleno-1',
    brand: 'Maruti Suzuki',
    model: 'Baleno',
    variant: 'Zeta 1.2',
    year: 2021,
    fuel: 'Petrol',
    transmission: 'Manual',
    km: 24500,
    price: 6.85, // 6.85 Lakhs
    emi: 12450,
    city: 'Bangalore',
    owner: '1st Owner',
    registrationYear: 2021,
    insuranceStatus: 'Comprehensive',
    serviceHistory: 'Full Dealership History',
    inspectionScore: 92,
    images: [
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      engine: '1197 cc, 4 Cylinders Inline',
      mileage: '21.01 kmpl',
      maxPower: '82 bhp @ 6000 rpm',
      seats: 5,
      color: 'Nexa Blue'
    },
    overview: 'This Baleno has been maintained meticulously in Nexa Authorized service stations. Single handed driven, paint is completely original, minor scratches on the left bumper have been professionally touched up. Impeccable fuel efficiency and comfortable cabin experience.'
  },
  {
    id: 'hyundai-i20-1',
    brand: 'Hyundai',
    model: 'i20',
    variant: 'Asta (O) 1.2',
    year: 2020,
    fuel: 'Petrol',
    transmission: 'Manual',
    km: 35200,
    price: 7.20,
    emi: 13100,
    city: 'Hyderabad',
    owner: '1st Owner',
    registrationYear: 2020,
    insuranceStatus: 'Comprehensive',
    serviceHistory: 'Full Dealership History',
    inspectionScore: 89,
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      engine: '1197 cc, Petrol, 83 bhp',
      mileage: '20.3 kmpl',
      maxPower: '83 bhp @ 6000 rpm',
      seats: 5,
      color: 'Fiery Red'
    },
    overview: 'Top-end variant featuring a sunroof, Bose speaker system, and wireless charging. Pristine interior condition, tyres replaced last year with brand new Bridgestone units. Non-accidental, fully verified and ready for transfer.'
  },
  {
    id: 'honda-city-1',
    brand: 'Honda',
    model: 'City',
    variant: 'ZX i-VTEC',
    year: 2019,
    fuel: 'Petrol',
    transmission: 'Automatic',
    km: 48000,
    price: 9.45,
    emi: 17200,
    city: 'Chennai',
    owner: '1st Owner',
    registrationYear: 2019,
    insuranceStatus: 'Comprehensive',
    serviceHistory: 'Full Dealership History',
    inspectionScore: 94,
    images: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      engine: '1497 cc, i-VTEC Engine',
      mileage: '17.4 kmpl',
      maxPower: '117 bhp @ 6600 rpm',
      seats: 5,
      color: 'Platinum White'
    },
    overview: 'An absolute luxury cruiser, the legendary Honda City. This is the top-end ZX variant with automatic CVT transmission (paddle shifters). Beige leather upholstery, automatic day-night IRVM, with detailed service logs from Honda Worli.'
  },
  {
    id: 'tata-nexon-1',
    brand: 'Tata',
    model: 'Nexon',
    variant: 'XZA Plus (O)',
    year: 2022,
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: 18200,
    price: 11.25,
    emi: 20500,
    city: 'Kochi',
    owner: '1st Owner',
    registrationYear: 2022,
    insuranceStatus: 'Comprehensive',
    serviceHistory: 'Full Dealership History',
    inspectionScore: 96,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      engine: '1497 cc, Turbo Diesel, 108 bhp',
      mileage: '21.5 kmpl',
      maxPower: '108 bhp @ 4000 rpm',
      seats: 5,
      color: 'Foliage Green'
    },
    overview: 'Built like a tank with 5-star global NCAP rating. This diesel automatic AMT nexon packs extreme highway performance with cruise control, ventilated seats, air purifier, and iRA Connected car tech. Barely driven.'
  },
  {
    id: 'mahindra-xuv700-1',
    brand: 'Mahindra',
    model: 'XUV700',
    variant: 'AX7 Luxury Pack AWD',
    year: 2022,
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: 29000,
    price: 22.80,
    emi: 41500,
    city: 'Hyderabad',
    owner: '1st Owner',
    registrationYear: 2022,
    insuranceStatus: 'Comprehensive',
    serviceHistory: 'Full Dealership History',
    inspectionScore: 98,
    images: [
      'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1625217527288-93919c99650a?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      engine: '2198 cc, mHawk Turbo Diesel',
      mileage: '15.5 kmpl',
      maxPower: '182 bhp @ 3500 rpm',
      seats: 7,
      color: 'Midnight Black'
    },
    overview: 'The pinnacle of Indian SUVs, this XUV700 includes ADAS (Adaptive Cruise Control, Lane Keep Assist), Sony 12-Speaker Sound System, Panoramic Skyroof, and All-Wheel Drive. Maintained exclusively under warranty package.'
  },
  {
    id: 'toyota-fortuner-1',
    brand: 'Toyota',
    model: 'Fortuner',
    variant: '2.8 4x2 AT',
    year: 2018,
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: 84000,
    price: 27.50,
    emi: 50400,
    city: 'Bangalore',
    owner: '2nd Owner',
    registrationYear: 2018,
    insuranceStatus: 'Third Party',
    serviceHistory: 'Full Dealership History',
    inspectionScore: 91,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      engine: '2755 cc, D-4D diesel',
      mileage: '14.2 kmpl',
      maxPower: '174 bhp @ 3400 rpm',
      seats: 7,
      color: 'Super White'
    },
    overview: 'Indestructible Toyota engineering. This Fortuner has been highway-driven, serviced rigorously every 10,000 km at Toyota Bangalore. Complete leather upholstery in rich tan brown, dual-zone digital AC, suspension check completed.'
  },
  {
    id: 'kia-seltos-1',
    brand: 'Kia',
    model: 'Seltos',
    variant: 'HTX Plus 1.5 Diesel',
    year: 2021,
    fuel: 'Diesel',
    transmission: 'Manual',
    km: 31000,
    price: 13.95,
    emi: 25400,
    city: 'Chennai',
    owner: '1st Owner',
    registrationYear: 2021,
    insuranceStatus: 'Comprehensive',
    serviceHistory: 'Full Dealership History',
    inspectionScore: 93,
    images: [
      'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      engine: '1493 cc, CRDi Diesel, 113 bhp',
      mileage: '21.0 kmpl',
      maxPower: '113 bhp @ 4000 rpm',
      seats: 5,
      color: 'Gravity Gray'
    },
    overview: 'Modern high-tech SUV loaded with electronic power seats, Bose audio, UVO connected app support, ambient mood lighting, and integrated air purifier. Very gentle city usage with flawless steering and clutch dynamics.'
  },
  {
    id: 'maruti-swift-1',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'VXI 1.2',
    year: 2018,
    fuel: 'Petrol',
    transmission: 'Manual',
    km: 55000,
    price: 4.65,
    emi: 8450,
    city: 'Coimbatore',
    owner: '2nd Owner',
    registrationYear: 2018,
    insuranceStatus: 'Comprehensive',
    serviceHistory: 'Partial History',
    inspectionScore: 86,
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      engine: '1197 cc, Petrol',
      mileage: '22.0 kmpl',
      maxPower: '82 bhp @ 6000 rpm',
      seats: 5,
      color: 'Solid Red'
    },
    overview: 'The quintessential Indian family hatchback. This Swift VXI has been serviced in Coimbatore and features aftermarket alloy wheels, leather upholstery, and Bluetooth entertainment screen. Extremely low running costs.'
  },
  {
    id: 'honda-amaze-1',
    brand: 'Honda',
    model: 'Amaze',
    variant: '1.2 VX CVT',
    year: 2021,
    fuel: 'Petrol',
    transmission: 'Automatic',
    km: 21000,
    price: 7.65,
    emi: 13900,
    city: 'Hyderabad',
    owner: '1st Owner',
    registrationYear: 2021,
    insuranceStatus: 'Comprehensive',
    serviceHistory: 'Full Dealership History',
    inspectionScore: 90,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      engine: '1199 cc, SOHC i-VTEC',
      mileage: '18.3 kmpl',
      maxPower: '89 bhp @ 6000 rpm',
      seats: 5,
      color: 'Golden Brown'
    },
    overview: 'Amazing compact sedan with a massive 420-litre boot space. Smooth CVT automatic transmission is a bliss in Hyderabad rush-hour traffic. Touchscreen infotainment with Apple CarPlay and Android Auto setup.'
  },
  {
    id: 'volkswagen-polo-1',
    brand: 'Volkswagen',
    model: 'Polo',
    variant: '1.0 TSI Highline Plus',
    year: 2021,
    fuel: 'Petrol',
    transmission: 'Manual',
    km: 28000,
    price: 8.25,
    emi: 15100,
    city: 'Visakhapatnam',
    owner: '1st Owner',
    registrationYear: 2021,
    insuranceStatus: 'Comprehensive',
    serviceHistory: 'Full Dealership History',
    inspectionScore: 95,
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      engine: '1000 cc, 3-Cylinder Turbo TSI',
      mileage: '18.24 kmpl',
      maxPower: '109 bhp @ 5000 rpm',
      seats: 5,
      color: 'Flash Red'
    },
    overview: 'The absolute enthusiasts hatchback. Driven purely on premium 95-octane petrol, this Polo TSI gives incredible mid-range acceleration. It has the legendary tight handling German chassis and pristine electronic condition.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Rajesh Kumar',
    location: 'Bangalore',
    rating: 5,
    text: 'Formulating trust around a used car is hard, but ManaUsedCars made it simple. The 100-point inspection report was extremely accurate, and my Baleno drives like dynamic clockwork!',
    carModel: 'Maruti Suzuki Baleno'
  },
  {
    id: 't2',
    name: 'Priya Sharma',
    location: 'Chennai',
    rating: 5,
    text: 'Sold my Swift through ManaUsedCars. Got a free doorstep evaluation on the same day and a price that was 15% higher than local dealers. Money was credited directly within an hour of RC handover!',
    carModel: 'Maruti Suzuki Swift'
  },
  {
    id: 't3',
    name: 'Aniket Deshmukh',
    location: 'Kochi',
    rating: 4.8,
    text: 'Amazing experience. Bought a used Tata Nexon which had fully verifiable dealer logs. The insurance transfer assistance was seamless and done without visiting the RTO.',
    carModel: 'Tata Nexon'
  },
  {
    id: 't4',
    name: 'Vikram Reddy',
    location: 'Hyderabad',
    rating: 5,
    text: 'Highly recommended doorstep car servicing booking. They came right to my apartment, did full oil replacement and filters, and saved me a huge weekend trip to the workshop. Pristine service dashboard.',
    carModel: 'Booking Customer'
  }
];

export const FAQS: FAQ[] = [
  {
    id: 'faq1',
    question: 'How are certified used cars inspected on ManaUsedCars?',
    answer: 'Every car displayed on ManaUsedCars goes through a comprehensive 150-point technical checkup. This includes engine performance, transmission safety, steering responsiveness, structural integrity, electrical operations, and odometer tampering validation.'
  },
  {
    id: 'faq2',
    question: 'Do you offer instant doorstep valuation for my car?',
    answer: 'Yes! Simply navigate to our "Sell My Car" hub, type in your vehicle and contact details. We calculate a precise real-time market estimation based on historical Indian resale patterns, and can schedule a physical doorstep evaluation within 24 hours.'
  },
  {
    id: 'faq3',
    question: 'How does the door-step serving model operate?',
    answer: 'We partnered with trained local mechanics across metro cities. When you book a servicing slot, our mobile workshop van reaches your doorstep equipped with authentic OEM filters, high-grade synthetic engine oils, and computer diagnostic units. You watch the entire service happening live.'
  },
  {
    id: 'faq4',
    question: 'Can I purchase financing plans for used cars on ManaUsedCars?',
    answer: 'Absolutely. We collaborate with India\'s premier private bank partners (HDFC, ICICI, IDFC First, and Axis) to offer interest rates starting from 9.25%. Our interactive loan system estimates your ideal tenure and monthly EMI instantly.'
  },
  {
    id: 'faq5',
    question: 'Are there any hidden costs involved in RC Transfer?',
    answer: 'No. Transparent pricing is our fundamental pledge. Registration Certificate transfer is managed completely free of charge by our operations support, with no hidden commission and absolute clarity on all RTO parameters.'
  }
];
