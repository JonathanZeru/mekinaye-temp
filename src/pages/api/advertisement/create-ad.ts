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

      if (!name || !description || !image || !image.filepath) {
        return res.status(400).json({ error: 'All fields (name, description, and image) are required' });
      }

      try {
        const uploadDir = path.join(process.cwd(), '/public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const newFilePath = path.join(uploadDir, image.newFilename || 'default.png'); // Handle missing newFilename
        console.log('Moving file to:', newFilePath);
        fs.renameSync(image.filepath, newFilePath);

        const imagePath = `/uploads/${image.newFilename || 'default.png'}`; // Handle missing newFilename

        const advertisement = await prisma.advertisement.create({
          data: {
            name: name as string,
            description: description as string,
            image: imagePath,
          },
        });

        res.status(201).json({
          message: "Advertisement created successfully",
          data: advertisement,
        });
      } catch (error) {
        console.error('Error creating advertisement:', error);
        res.status(500).json({ error: error });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
