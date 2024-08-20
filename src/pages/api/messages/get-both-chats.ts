import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';

const authenticateToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token is required' });
    }

    const payload = authenticateToken(token);

    if (!payload || !payload.id) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    try {
      // Get the senderId and receiverId from the URL query parameters
      const { senderId, receiverId } = req.query;

      if (!senderId || !receiverId) {
        return res.status(400).json({ error: 'Both senderId and receiverId are required' });
      }

      // Fetch messages between the specific sender and receiver
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: Number(senderId), receiverId: Number(receiverId) },
            { senderId: Number(receiverId), receiverId: Number(senderId) },
          ],
        },
        select: {
          id: true,
          senderId: true,
          receiverId: true,
          text: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',  // Ascending order so that conversation history is shown correctly
        },
      });

      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
