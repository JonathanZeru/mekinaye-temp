import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const sparePart = await prisma.sparePart.findUnique({
        where: { id: Number(id) }
      });
      if (sparePart) {
        res.status(200).json(sparePart);
      } else {
        res.status(404).json({ error: 'Spare part not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch spare part' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
