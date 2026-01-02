import { Express } from "express";
import { db } from "./db";
import { cars, events, categories, heroSlides, siteContent } from "../shared/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";
import { upload, processAndSaveImage, deleteImage } from "./upload";

export function registerRoutes(app: Express) {
  app.post("/api/upload", requireAuth, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const imageUrl = await processAndSaveImage(req.file.buffer, req.file.originalname);
      res.json({ url: imageUrl });
    } catch (err) {
      console.error("Error uploading image:", err);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.post("/api/upload/multiple", requireAuth, upload.array("images", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No image files provided" });
      }

      const urls = await Promise.all(
        files.map(file => processAndSaveImage(file.buffer, file.originalname))
      );
      res.json({ urls });
    } catch (err) {
      console.error("Error uploading images:", err);
      res.status(500).json({ error: "Failed to upload images" });
    }
  });

  app.delete("/api/upload", requireAuth, async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "No image URL provided" });
      }

      const deleted = deleteImage(url);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Image not found or could not be deleted" });
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      res.status(500).json({ error: "Failed to delete image" });
    }
  });


  app.get("/api/cars", async (req, res) => {
    try {
      const allCars = await db.select().from(cars);
      const formattedCars = allCars.map(car => ({
        id: car.externalId,
        dbId: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        type: car.type,
        images: car.images,
        description: car.description,
        specs: {
          horsepower: car.horsepower,
          topSpeedMph: car.topSpeedMph,
          zeroToSixty: parseFloat(car.zeroToSixty),
          engine: car.engine,
          mpgCity: car.mpgCity,
          mpgHwy: car.mpgHwy,
          mileage: car.mileage,
        },
        features: car.features,
      }));
      res.json(formattedCars);
    } catch (err) {
      console.error("Error fetching cars:", err);
      res.status(500).json({ error: "Failed to fetch cars" });
    }
  });

  app.post("/api/cars", requireAuth, async (req, res) => {
    try {
      const { id, make, model, year, price, type, images, description, specs, features } = req.body;
      const [newCar] = await db.insert(cars).values({
        externalId: id || Date.now().toString(),
        make,
        model,
        year,
        price,
        type,
        images: images || [],
        description,
        horsepower: specs.horsepower,
        topSpeedMph: specs.topSpeedMph,
        zeroToSixty: specs.zeroToSixty.toString(),
        engine: specs.engine,
        mpgCity: specs.mpgCity,
        mpgHwy: specs.mpgHwy,
        mileage: specs.mileage,
        features: features || [],
      }).returning();
      res.status(201).json(newCar);
    } catch (err) {
      console.error("Error creating car:", err);
      res.status(500).json({ error: "Failed to create car" });
    }
  });

  app.put("/api/cars/:id", requireAuth, async (req, res) => {
    try {
      const { make, model, year, price, type, images, description, specs, features } = req.body;
      
      const [existingCar] = await db.select().from(cars).where(eq(cars.externalId, req.params.id));
      const oldImages = existingCar?.images || [];
      
      const [updated] = await db.update(cars)
        .set({
          make,
          model,
          year,
          price,
          type,
          images: images || [],
          description,
          horsepower: specs.horsepower,
          topSpeedMph: specs.topSpeedMph,
          zeroToSixty: specs.zeroToSixty.toString(),
          engine: specs.engine,
          mpgCity: specs.mpgCity,
          mpgHwy: specs.mpgHwy,
          mileage: specs.mileage,
          features: features || [],
        })
        .where(eq(cars.externalId, req.params.id))
        .returning();
      if (!updated) {
        return res.status(404).json({ error: "Car not found" });
      }
      
      const newImages = images || [];
      for (const oldImg of oldImages) {
        if (oldImg.startsWith('/uploads/') && !newImages.includes(oldImg)) {
          deleteImage(oldImg);
        }
      }
      
      res.json(updated);
    } catch (err) {
      console.error("Error updating car:", err);
      res.status(500).json({ error: "Failed to update car" });
    }
  });

  app.delete("/api/cars/:id", requireAuth, async (req, res) => {
    try {
      const [car] = await db.select().from(cars).where(eq(cars.externalId, req.params.id));
      if (car && car.images) {
        for (const img of car.images) {
          if (img.startsWith('/uploads/')) {
            deleteImage(img);
          }
        }
      }
      await db.delete(cars).where(eq(cars.externalId, req.params.id));
      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting car:", err);
      res.status(500).json({ error: "Failed to delete car" });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const allEvents = await db.select().from(events);
      const formattedEvents = allEvents.map(e => ({
        id: e.externalId,
        title: e.title,
        date: e.date,
        location: e.location,
        description: e.description,
        image: e.image,
      }));
      res.json(formattedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events", requireAuth, async (req, res) => {
    try {
      const { id, title, date, location, description, image } = req.body;
      const [newEvent] = await db.insert(events).values({
        externalId: id || Date.now().toString(),
        title,
        date,
        location,
        description,
        image,
      }).returning();
      res.status(201).json(newEvent);
    } catch (err) {
      console.error("Error creating event:", err);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.put("/api/events/:id", requireAuth, async (req, res) => {
    try {
      const { title, date, location, description, image } = req.body;
      
      const [existingEvent] = await db.select().from(events).where(eq(events.externalId, req.params.id));
      const oldImage = existingEvent?.image || null;
      
      const [updated] = await db.update(events)
        .set({ title, date, location, description, image })
        .where(eq(events.externalId, req.params.id))
        .returning();
      if (!updated) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      if (oldImage && oldImage.startsWith('/uploads/') && oldImage !== image) {
        deleteImage(oldImage);
      }
      
      res.json(updated);
    } catch (err) {
      console.error("Error updating event:", err);
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", requireAuth, async (req, res) => {
    try {
      const [event] = await db.select().from(events).where(eq(events.externalId, req.params.id));
      if (event && event.image && event.image.startsWith('/uploads/')) {
        deleteImage(event.image);
      }
      await db.delete(events).where(eq(events.externalId, req.params.id));
      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting event:", err);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await db.select().from(categories);
      res.json(allCategories.map(c => c.name));
    } catch (err) {
      console.error("Error fetching categories:", err);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", requireAuth, async (req, res) => {
    try {
      const { name } = req.body;
      const [newCategory] = await db.insert(categories).values({ name }).returning();
      res.status(201).json(newCategory);
    } catch (err) {
      console.error("Error creating category:", err);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.delete("/api/categories/:name", requireAuth, async (req, res) => {
    try {
      await db.delete(categories).where(eq(categories.name, req.params.name));
      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting category:", err);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  app.get("/api/hero-slides", async (req, res) => {
    try {
      const allSlides = await db.select().from(heroSlides).orderBy(heroSlides.sortOrder);
      const allCars = await db.select().from(cars);
      
      const formattedSlides = allSlides.map(s => {
        let resolvedImage = s.image;
        if (s.carId) {
          const car = allCars.find(c => c.id === s.carId);
          if (car && car.images && car.images.length > 0) {
            const imageIndex = s.selectedImageIndex || 0;
            resolvedImage = car.images[Math.min(imageIndex, car.images.length - 1)];
          }
        }
        return {
          id: s.externalId,
          carId: s.carId,
          selectedImageIndex: s.selectedImageIndex,
          image: resolvedImage,
          title: s.title,
          subtitle: s.subtitle,
        };
      });
      res.json(formattedSlides);
    } catch (err) {
      console.error("Error fetching hero slides:", err);
      res.status(500).json({ error: "Failed to fetch hero slides" });
    }
  });

  app.post("/api/hero-slides", requireAuth, async (req, res) => {
    try {
      const { id, carId, selectedImageIndex, title, subtitle } = req.body;
      
      if (!carId || typeof carId !== 'number') {
        return res.status(400).json({ error: "Valid carId is required" });
      }
      
      const [car] = await db.select().from(cars).where(eq(cars.id, carId));
      if (!car) {
        return res.status(400).json({ error: "Car not found" });
      }
      
      const maxOrder = await db.select().from(heroSlides);
      const sortOrder = maxOrder.length;
      const [newSlide] = await db.insert(heroSlides).values({
        externalId: id || Date.now().toString(),
        carId,
        selectedImageIndex: selectedImageIndex || 0,
        image: '',
        title,
        subtitle,
        sortOrder,
      }).returning();
      res.status(201).json({
        id: newSlide.externalId,
        carId: newSlide.carId,
        selectedImageIndex: newSlide.selectedImageIndex,
        title: newSlide.title,
        subtitle: newSlide.subtitle,
      });
    } catch (err) {
      console.error("Error creating hero slide:", err);
      res.status(500).json({ error: "Failed to create hero slide" });
    }
  });

  app.put("/api/hero-slides/:id", requireAuth, async (req, res) => {
    try {
      const { carId, selectedImageIndex, title, subtitle } = req.body;
      
      if (carId !== undefined && carId !== null) {
        const [car] = await db.select().from(cars).where(eq(cars.id, carId));
        if (!car) {
          return res.status(400).json({ error: "Car not found" });
        }
      }
      
      const updateData: Record<string, any> = {};
      if (carId !== undefined) updateData.carId = carId;
      if (selectedImageIndex !== undefined) updateData.selectedImageIndex = selectedImageIndex;
      if (title !== undefined) updateData.title = title;
      if (subtitle !== undefined) updateData.subtitle = subtitle;
      
      const [updated] = await db.update(heroSlides)
        .set(updateData)
        .where(eq(heroSlides.externalId, req.params.id))
        .returning();
      if (!updated) {
        return res.status(404).json({ error: "Hero slide not found" });
      }
      
      res.json({
        id: updated.externalId,
        carId: updated.carId,
        selectedImageIndex: updated.selectedImageIndex,
        title: updated.title,
        subtitle: updated.subtitle,
      });
    } catch (err) {
      console.error("Error updating hero slide:", err);
      res.status(500).json({ error: "Failed to update hero slide" });
    }
  });

  app.delete("/api/hero-slides/:id", requireAuth, async (req, res) => {
    try {
      const [slide] = await db.select().from(heroSlides).where(eq(heroSlides.externalId, req.params.id));
      if (slide && slide.image && slide.image.startsWith('/uploads/')) {
        deleteImage(slide.image);
      }
      await db.delete(heroSlides).where(eq(heroSlides.externalId, req.params.id));
      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting hero slide:", err);
      res.status(500).json({ error: "Failed to delete hero slide" });
    }
  });

  app.get("/api/site-content", async (req, res) => {
    try {
      const content = await db.select().from(siteContent);
      const result: Record<string, any> = {};
      for (const item of content) {
        result[item.key] = item.value;
      }
      res.json(result);
    } catch (err) {
      console.error("Error fetching site content:", err);
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  app.put("/api/site-content/:key", requireAuth, async (req, res) => {
    try {
      const { value } = req.body;
      const existing = await db.select().from(siteContent).where(eq(siteContent.key, req.params.key));
      
      if (existing.length > 0) {
        const [updated] = await db.update(siteContent)
          .set({ value })
          .where(eq(siteContent.key, req.params.key))
          .returning();
        res.json(updated);
      } else {
        const [created] = await db.insert(siteContent)
          .values({ key: req.params.key, value })
          .returning();
        res.status(201).json(created);
      }
    } catch (err) {
      console.error("Error updating site content:", err);
      res.status(500).json({ error: "Failed to update site content" });
    }
  });
}
