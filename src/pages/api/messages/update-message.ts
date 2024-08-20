import { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

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
  // Run CORS middleware

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

    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid or missing message ID' });
    }

    const form = new IncomingForm({ keepExtensions: true, maxFileSize: 5 * 1024 * 1024 });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ error: 'Failed to process form data' });
      }

      const text = Array.isArray(fields.text) ? fields.text[0] : fields.text;

      const imageFile = files.image as File | File[] | undefined;
      let imageUrl = null;

      if (Array.isArray(imageFile)) {
        // If it's an array, use the first file
        const image = imageFile[0];
        imageUrl = await handleFileUpload(image);
      } else if (imageFile) {
        // If it's a single file
        imageUrl = await handleFileUpload(imageFile);
      }

      try {
        const message = await prisma.message.findUnique({
          where: { id: parseInt(id as string) },
        });

        if (!message) {
          return res.status(404).json({ error: 'Message not found' });
        }

        if (message.senderId !== payload.id) {
          return res.status(403).json({ error: 'Unauthorized: You can only update your own messages' });
        }

        const updatedMessage = await prisma.message.update({
          where: { id: parseInt(id as string) },
          data: {
            text: text || message.text,  // Update text if provided
            imageUrl: imageUrl || message.imageUrl,  // Update image URL if provided
          },
        });

        res.status(200).json({
          "mesaage": "Message updated successfully",
          "data": updatedMessage
        });
      } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error });
      }
    });
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Helper function to handle file upload
const handleFileUpload = async (file: File): Promise<string> => {
  const uploadDir = path.join(process.cwd(), 'public/uploads/messages');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const newFilePath = path.join(uploadDir, file.newFilename || 'default.png');
  fs.renameSync(file.filepath, newFilePath);

  return `/uploads/messages/${file.newFilename || 'default.png'}`;
};
