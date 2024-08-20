import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    const { id } = req.query;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
      const carBrand = await prisma.carBrand.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!carBrand) {
        return res.status(404).json({ error: 'Car brand not found' });
      }

      res.status(200).json(carBrand);
    } catch (error) {
      console.error('Error fetching car brand:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
