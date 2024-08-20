import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';


// Initialize Prisma Client
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';

// Helper function to authenticate token
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

    const form = new IncomingForm({ keepExtensions: true, maxFileSize: 5 * 1024 * 1024 });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to process form data' });
      }

      const advertisementId = req.query.id; // Get the advertisement ID from the query parameters
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;

      // Handle files.image which could be an array or a single file
      const imageFile = files.image;
      let image: File | null = null;

      if (Array.isArray(imageFile)) {
        // If it's an array, use the first file
        image = imageFile[0];
      } else if (imageFile) {
        // If it's a single file
        image = imageFile;
      }

      if (!advertisementId) {
        return res.status(400).json({ error: 'Advertisement ID is required' });
      }

      try {
        const existingAd = await prisma.advertisement.findUnique({
          where: { id: parseInt(advertisementId as string) },
        });

        if (!existingAd) {
          return res.status(404).json({ error: 'Advertisement not found' });
        }

        let updatedData: any = {
          name: name || existingAd.name,
          description: description || existingAd.description,
        };

        if (image && image.filepath) {
          const uploadDir = path.join(process.cwd(), '/public/uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const newFilePath = path.join(uploadDir, image.newFilename || 'default.png'); // Handle missing newFilename
          console.log('Moving file to:', newFilePath);
          fs.renameSync(image.filepath, newFilePath);

          updatedData.image = `/uploads/${image.newFilename || 'default.png'}`; // Handle missing newFilename
        }

        const updatedAd = await prisma.advertisement.update({
          where: { id: parseInt(advertisementId as string) },
          data: updatedData,
        });

        res.status(200).json({
          message: "Advertisement updated successfully",
          data: updatedAd,
        });
      } catch (error) {
        console.error('Error updating advertisement:', error);
        res.status(500).json({ error: error });
      }
    });
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
