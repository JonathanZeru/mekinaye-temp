import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      await prisma.sparePart.deleteMany();
      res.status(200).json({ message: 'All spare parts deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete all spare parts' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
