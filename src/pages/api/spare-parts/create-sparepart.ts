import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';

const authenticateToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token is required' });
    }

    const payload = authenticateToken(token);

    if (!payload || !payload.id) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to process form data' });
      }

      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
      const carBrandId = Array.isArray(fields.carBrandId) ? fields.carBrandId[0] : fields.carBrandId;

      // Handle files.image which could be an array or a single file
      const imageFile = files.image;
      let image: File | null = null;

      if (Array.isArray(imageFile)) {
        image = imageFile[0];
      } else if (imageFile) {
        image = imageFile;
      }

      if (!name || !description || !price || !carBrandId || !image || !image.filepath) {
        return res.status(400).json({
          error: `All fields (name: ${name}, description: ${description}, price: ${price}, carBrandId: ${carBrandId}, and image) are required`
        });
      }

      try {
        // Check if the car brand exists
        const carBrand = await prisma.carBrand.findUnique({
          where: { id: Number(carBrandId) },
        });

        if (!carBrand) {
          return res.status(404).json({ error: 'Car brand not found' });
        }

        // Ensure the uploads directory exists
        const uploadDir = path.join(process.cwd(), '/public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Move and rename the image file
        const newFilePath = path.join(uploadDir, image.newFilename || 'default.png');
        fs.renameSync(image.filepath, newFilePath);

        const imagePath = `/uploads/${image.newFilename || 'default.png'}`;

        // Create a new spare part entry
        const newSparePart = await prisma.sparePart.create({
          data: {
            name: name as string,
            description: description as string,
            price: Number(price),
            image: imagePath as string,
            carBrandId: Number(carBrandId),
          },
        });

        res.status(201).json({
          message: "Spare part created successfully",
          data: newSparePart
        });
      } catch (error) {
        console.error('Error creating spare part:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
