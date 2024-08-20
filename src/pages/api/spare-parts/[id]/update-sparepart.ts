import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';

// Initialize Prisma Client
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
  if (req.method === 'PUT') {
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
      const imageFile = files.image;

      // Handle image file
      let image: File | null = null;
      if (Array.isArray(imageFile)) {
        image = imageFile[0];
      } else if (imageFile) {
        image = imageFile;
      }

      if (!name || !description || !price || !carBrandId) {
        return res.status(400).json({ error: 'Name, description, price, and carBrandId are required' });
      }

      try {
        // Fetch the car brand associated with the authenticated user
        const carBrand = await prisma.carBrand.findFirst({
          where: {
            ownerId: payload.id,
          },
        });

        if (!carBrand) {
          return res.status(404).json({ error: 'Car brand not found' });
        }

        let imagePath = carBrand.image; // Preserve existing image path if no new image is provided

        if (image) {
          // Ensure the uploads directory exists
          const uploadDir = path.join(process.cwd(), '/public/uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          // Move and rename the image file
          const newFileName = image.newFilename || 'default.png'; // Handle missing newFilename
          const newFilePath = path.join(uploadDir, newFileName);
          fs.renameSync(image.filepath, newFilePath);

          imagePath = `/uploads/${newFileName}`;
        }

        const updatedCarBrand = await prisma.sparePart.update({
          where: { id: carBrand.id },
          data: {
            name: name as string,
            description: description as string,
            price: Number(price),
            carBrandId: Number(carBrandId),
            image: imagePath,
            updatedAt: new Date(),
          },
        });

        res.status(200).json({
          message: 'Update successful',
          data: updatedCarBrand
        });
      } catch (error) {
        console.error('Error updating spare part:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
