import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    try {
      jwt.verify(token, SECRET_KEY as string);

      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: { status: '0' }
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
