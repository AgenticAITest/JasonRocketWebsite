import { db } from "./db";
import { cars, events, categories, siteContent, adminUsers, heroSlides } from "../shared/schema";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";

const DEFAULT_CATEGORIES = [
  'Classic 4x4',
  'Muscle',
  'Vintage Sport',
  'Modern Classic',
  'Truck',
  'Wagon'
];

const DEFAULT_EVENTS = [
  {
    id: 'e1',
    title: 'Morning Fuel: Cars & Coffee',
    date: 'Oct 15, 2023',
    location: 'RMC Main Garage',
    description: 'The monthly gathering of Jakarta\'s finest air-cooled and vintage iron. High-octane conversation and specialty brews.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'e2',
    title: 'Sentul Track Day Invitational',
    date: 'Nov 02, 2023',
    location: 'Sentul International Circuit',
    description: 'An exclusive track day for our performance clientele. Limited slots for pre-1990 sports cars.',
    image: 'https://images.unsplash.com/photo-1541890289-b86df5bafd81?q=80&w=2070&auto=format&fit=crop'
  }
];

const DEFAULT_SITE_CONTENT = {
  hero: {
    title: "Driven by Passion.",
    subtitle: "Rocket Motor Company curates the finest selection of vintage 4x4s, American muscle, air-cooled classics, and high-performance sport bikes. We don't just sell machines; we preserve history.",
    estYear: "Est. 2021",
  },
  services: {
    title: "Service & Care",
    description: "Maintaining the legacy of your machine. We offer specialized care for vintage and performance vehicles."
  },
  contact: {
    address: "Jalan RS Fatmawati. 1, Jl. Banjarsari IV No.1, Cilandak Bar., Jakarta Selatan 12430",
    phone1: "0857-3300-0561",
    phone2: "0813-1110-9913",
    email: "info@rocketmotorcompany.com",
    openingHoursWeek: "Open 10.00-17.00 Monday-Friday",
    openingHoursSat: "10.00-16.00 Saturday (By Appointment)"
  }
};

const CARS_DATA = [
  {
    id: 'c1',
    make: 'Ford',
    model: 'Bronco Ranger',
    year: 1974,
    price: 85000,
    type: 'Classic 4x4',
    images: [
      '/uploads/images/car_1_1_stock.webp', 
      '/uploads/images/car_1_2_stock.webp'
    ],
    description: 'A stunning, frame-off restored 1974 Ford Bronco in Brittany Blue. This uncut gem features a rebuilt 302 V8 and a modern suspension lift, blending classic ruggedness with drivable comfort. A true collector\'s piece.',
    specs: {
      horsepower: 205,
      topSpeedMph: 90,
      zeroToSixty: 9.5,
      engine: '5.0L 302 V8',
      mpgCity: 12,
      mpgHwy: 15,
      mileage: 1540
    },
    features: ['Uncut Fenders', 'Removable Hardtop', 'Dana 44 Front Axle', 'Vintage Air A/C']
  },
  {
    id: 'c2',
    make: 'Land Rover',
    model: 'Defender 90 NAS',
    year: 1997,
    price: 115000,
    type: 'Classic 4x4',
    images: [
      '/uploads/images/car_2_1_stock.webp',
      '/uploads/images/car_2_2_1766803993703.webp'
    ],
    description: 'One of the most sought-after 4x4s in existence. This North American Specification (NAS) D90 is finished in Alpine White with a roll cage and safari top. Rugged, capable, and undeniably cool.',
    specs: {
      horsepower: 182,
      topSpeedMph: 90,
      zeroToSixty: 10.0,
      engine: '4.0L V8',
      mpgCity: 14,
      mpgHwy: 16,
      mileage: 42000
    },
    features: ['Safari Cage', 'Warn Winch', 'Hella Spotlights', 'Rear Jump Seats']
  },
  {
    id: 'c3',
    make: 'Porsche',
    model: '911 SC Targa',
    year: 1982,
    price: 68500,
    type: 'Vintage Sport',
    images: [
      '/uploads/images/car_3_1_stock.webp',
      '/uploads/images/car_3_2_1766803995249.webp'
    ],
    description: 'Air-cooled perfection. This 911 SC Targa in Guards Red offers the quintessential analog driving experience. Meticulously maintained with numbers-matching engine and transmission.',
    specs: {
      horsepower: 204,
      topSpeedMph: 146,
      zeroToSixty: 6.5,
      engine: '3.0L Flat-6',
      mpgCity: 16,
      mpgHwy: 23,
      mileage: 89000
    },
    features: ['Fuchs Wheels', 'Targa Top', 'Sport Seats', 'Blaupunkt Audio']
  },
  {
    id: 'c4',
    make: 'Chevrolet',
    model: 'K5 Blazer',
    year: 1972,
    price: 72000,
    type: 'Classic 4x4',
    images: [
      '/uploads/images/car_4_1_1766803995958.webp'
    ],
    description: 'The ultimate beach cruiser. This \'72 K5 Blazer features a full convertible top and a stunning Ochre and White two-tone paint job. Powered by a crate 350 V8 for reliability and power.',
    specs: {
      horsepower: 350,
      topSpeedMph: 100,
      zeroToSixty: 8.0,
      engine: '5.7L V8 Crate',
      mpgCity: 10,
      mpgHwy: 13,
      mileage: 3500
    },
    features: ['Full Convertible Top', 'Houndstooth Interior', '33-inch Tires', 'Power Steering']
  },
  {
    id: 'c5',
    make: 'Ford',
    model: 'Mustang Fastback',
    year: 1967,
    price: 95000,
    type: 'Muscle',
    images: [
      '/uploads/images/car_5_1_1766803996403.webp',
      '/uploads/images/car_5_2_stock.webp'
    ],
    description: 'Bullitt vibes. This \'67 Fastback in Highland Green is a pro-touring build, featuring modern disc brakes, rack-and-pinion steering, and a roaring 390 big block engine.',
    specs: {
      horsepower: 325,
      topSpeedMph: 125,
      zeroToSixty: 6.2,
      engine: '6.4L 390 V8',
      mpgCity: 11,
      mpgHwy: 15,
      mileage: 5800
    },
    features: ['4-Speed Manual', 'Fold-down Rear Seat', 'Wilwood Brakes', 'Positraction']
  },
  {
    id: 'c6',
    make: 'Jeep',
    model: 'Grand Wagoneer',
    year: 1989,
    price: 48000,
    type: 'Wagon',
    images: [
      '/uploads/images/car_6_1_1766803997746.webp'
    ],
    description: 'The original luxury SUV. Finished in Hunter Green with iconic wood paneling. This Grand Wagoneer has been preserved in time, offering plush cordovan leather seats and that classic V8 rumble.',
    specs: {
      horsepower: 144,
      topSpeedMph: 95,
      zeroToSixty: 13.0,
      engine: '5.9L AMC V8',
      mpgCity: 11,
      mpgHwy: 13,
      mileage: 98000
    },
    features: ['Wood Paneling', 'Power Rear Window', 'Roof Rack', '4-Wheel Drive']
  }
];

async function seed() {
  console.log("Seeding database...");

  const existingCars = await db.select().from(cars);
  if (existingCars.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  for (const cat of DEFAULT_CATEGORIES) {
    await db.insert(categories).values({ name: cat }).onConflictDoNothing();
  }
  console.log("Categories seeded");

  for (const ev of DEFAULT_EVENTS) {
    await db.insert(events).values({
      externalId: ev.id,
      title: ev.title,
      date: ev.date,
      location: ev.location,
      description: ev.description,
      image: ev.image,
    }).onConflictDoNothing();
  }
  console.log("Events seeded");

  for (const car of CARS_DATA) {
    await db.insert(cars).values({
      externalId: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      type: car.type,
      images: car.images,
      description: car.description,
      horsepower: car.specs.horsepower,
      topSpeedMph: car.specs.topSpeedMph,
      zeroToSixty: car.specs.zeroToSixty.toString(),
      engine: car.specs.engine,
      mpgCity: car.specs.mpgCity,
      mpgHwy: car.specs.mpgHwy,
      mileage: car.specs.mileage,
      features: car.features,
    }).onConflictDoNothing();
  }
  console.log("Cars seeded");

  for (const [key, value] of Object.entries(DEFAULT_SITE_CONTENT)) {
    await db.insert(siteContent).values({ key, value }).onConflictDoNothing();
  }
  console.log("Site content seeded");

  const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.username, "admin"));
  if (existingAdmin.length === 0) {
    const hashedPassword = await hashPassword("admin123");
    await db.insert(adminUsers).values({
      username: "admin",
      password: hashedPassword,
    });
    console.log("Default admin user created (username: admin, password: admin123)");
  }

  console.log("Database seeding complete!");
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
