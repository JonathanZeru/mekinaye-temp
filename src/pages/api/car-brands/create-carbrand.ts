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
      const phoneNumber = Array.isArray(fields.phoneNumber) ? fields.phoneNumber[0] : fields.phoneNumber;

      const imageFile = files.image;
      let image: File | null = null;

      if (Array.isArray(imageFile)) {
        image = imageFile[0];
      } else if (imageFile) {
        image = imageFile;
      }

      if (!name || !description || !phoneNumber || !image || !image.filepath) {
        return res.status(400).json({ error: 'All fields (name, description, phone number, and image) are required' });
      }

      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
        });

        if (!user || user.type !== 'owner') {
          return res.status(403).json({ error: 'Unauthorized: Only owners can create car brands' });
        }

        const uploadDir = path.join(process.cwd(), '/public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const newFilePath = path.join(uploadDir, image.newFilename || 'default.png');
        console.log('Moving file to:', newFilePath);
        fs.renameSync(image.filepath, newFilePath);

        const imagePath = `/uploads/${image.newFilename || 'default.png'}`;

        const carBrand = await prisma.carBrand.create({
          data: {
            name: name as string,
            description: description as string,
            phoneNumber: phoneNumber as string,
            image: imagePath,
            ownerId: payload.id,
          },
        });

        res.status(201).json({
          message: "Registration successful",
          data: carBrand
        });
      } catch (error) {
        console.error('Error creating car brand:', error);
        res.status(500).json({ error: error.message });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
