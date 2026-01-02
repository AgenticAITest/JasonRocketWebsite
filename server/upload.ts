import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "..", "uploads", "images");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."));
    }
  },
});

export async function processAndSaveImage(buffer: Buffer, originalName: string): Promise<string> {
  const uniqueId = crypto.randomBytes(8).toString("hex");
  const baseName = path.basename(originalName, path.extname(originalName));
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9-_]/g, "_").substring(0, 50);
  const filename = `${sanitizedName}_${uniqueId}.webp`;
  const outputPath = path.join(uploadsDir, filename);

  await sharp(buffer)
    .resize(1600, 1600, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 80,
      effort: 4,
    })
    .toFile(outputPath);

  return `/uploads/images/${filename}`;
}

export function deleteImage(imagePath: string): boolean {
  try {
    if (!imagePath.startsWith("/uploads/images/")) {
      return false;
    }
    const filename = path.basename(imagePath);
    const fullPath = path.join(uploadsDir, filename);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error deleting image:", err);
    return false;
  }
}
