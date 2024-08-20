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

export const config = {
  api: {
    bodyParser: false,
  },
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

    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const messages = await prisma.message.findMany({
        where: {
          receiverId: Number(userId),
        },
        orderBy: {
          createdAt: 'desc', // Optionally order by date
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
