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
      // Get the unique user ID from the token payload
      const userId = payload.id;

      // Fetch all messages where the user is either sender or receiver
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
        select: {
          senderId: true,
          receiverId: true,
          text: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Extract unique user IDs
      const userIds = new Set<number>();
      messages.forEach(message => {
        if (message.senderId !== userId) userIds.add(message.senderId);
        if (message.receiverId !== userId) userIds.add(message.receiverId);
      });

      // Fetch user details for the unique user IDs
      const users = await prisma.user.findMany({
        where: {
          id: {
            in: Array.from(userIds),
          },
        },
      });

      // Prepare response with last message for each user
      const usersWithLastMessage = users.map(user => {
        // Find the last message with this user
        const lastMessage = messages.find(message =>
          (message.senderId === user.id && message.receiverId === userId) ||
          (message.receiverId === user.id && message.senderId === userId)
        );

        return {
          ...user,
          lastMessage: lastMessage ? {
            content: lastMessage.text,
            createdAt: lastMessage.createdAt,
          } : null,
        };
      });

      res.status(200).json(usersWithLastMessage);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
