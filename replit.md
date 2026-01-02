# Rocket Motor Company

## Overview
A full-stack luxury classic car dealership website built with React, TypeScript, Express.js, and PostgreSQL. Features a modern, dark-themed UI with gold accents showcasing vintage vehicles, American muscle cars, and high-performance sport bikes. Includes a CMS admin panel with persistent server-side storage.

## Tech Stack
- **Frontend**: React 19 with TypeScript
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Authentication**: Passport.js with session-based auth
- **AI Integration**: Google Generative AI (@google/genai) for concierge features

## Project Structure
```
├── server/
│   ├── index.ts          # Express server entry point
│   ├── db.ts             # Database connection
│   ├── auth.ts           # Authentication setup (Passport.js)
│   ├── routes.ts         # API routes for CRUD operations
│   ├── upload.ts         # Image upload processing (Sharp + Multer)
│   └── seed.ts           # Database seeding script
├── uploads/
│   └── images/           # Locally stored uploaded images (WebP format)
├── shared/
│   └── schema.ts         # Drizzle ORM schema definitions
├── components/
│   ├── ComparisonChart.tsx
│   └── Concierge.tsx
├── services/
│   └── geminiService.ts
├── App.tsx               # Main application component
├── constants.ts          # Default data (used for seeding)
├── types.ts              # TypeScript interfaces
├── index.tsx             # React entry point
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── drizzle.config.ts     # Drizzle ORM configuration
└── tsconfig.json         # TypeScript configuration
```

## Database Schema
- **admin_users**: Admin accounts with hashed passwords
- **cars**: Vehicle inventory with specs, images, and features (includes dbId for carousel linking)
- **events**: Upcoming events
- **categories**: Vehicle categories
- **hero_slides**: Hero carousel slides (linked to cars via car_id, with selected_image_index for multi-image cars)
- **site_content**: Site content (hero, services, contact info)

## API Endpoints
### Public
- `GET /api/cars` - List all vehicles
- `GET /api/events` - List all events
- `GET /api/categories` - List all categories
- `GET /api/hero-slides` - List hero slides
- `GET /api/site-content` - Get site content

### Admin (Requires Authentication)
- `POST/PUT/DELETE /api/cars/:id` - Manage vehicles
- `POST/PUT/DELETE /api/events/:id` - Manage events
- `POST/DELETE /api/categories/:name` - Manage categories
- `POST/PUT/DELETE /api/hero-slides/:id` - Manage hero slides
- `PUT /api/site-content/:key` - Update site content
- `POST /api/upload` - Upload single image (auto-resized to 1600px, WebP format)
- `POST /api/upload/multiple` - Upload multiple images
- `DELETE /api/upload` - Delete uploaded image

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `POST /api/admin/register` - Admin registration
- `GET /api/admin/user` - Get current admin user

## Development
- **Dev Server**: `npm run dev` - Runs Express + Vite on port 5000
- **Build**: `npm run build` - Build for production
- **Database Push**: `npm run db:push` - Push schema changes
- **Database Seed**: `npm run db:seed` - Seed database with initial data

## Admin Access
Default admin credentials (created during seeding):
- **Username**: admin
- **Password**: admin123

Access via the "Staff Access" link in the footer.

## Changes Made for Replit Environment
- **vite.config.ts**: Port 5000, allowedHosts: true
- **index.html**: Added script entry point
- **Full-stack conversion**: Added Express.js backend, PostgreSQL database, Drizzle ORM
- **Persistent CMS**: All admin changes now persist to PostgreSQL
- **Session auth**: Admin login/logout with secure sessions
- **Deployment**: Autoscale deployment with Express backend

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (auto-set by Replit)
- `SESSION_SECRET`: Session encryption key (auto-generated if not set)
- `GEMINI_API_KEY`: Required for AI concierge features (optional)

## Features
- Hero carousel with featured vehicles
- Vehicle showroom with filtering
- Vehicle detail modals
- Services page
- Events section
- Vehicle comparison tool
- AI-powered concierge (requires Gemini API key)
- **Admin CMS Dashboard**:
  - Manage vehicle inventory (add/edit/delete cars)
  - Manage events
  - Manage categories
  - Hero Carousel: Select vehicles from inventory to feature on homepage
    - Click a vehicle card to add it to carousel
    - Choose which image to display if vehicle has multiple images
    - Customize title/subtitle for each slide
    - Images automatically resolved from linked car's image gallery
  - Edit site content (hero text, contact info)
  - All changes persist to PostgreSQL database
