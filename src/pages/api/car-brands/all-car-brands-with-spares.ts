import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';


// Initialize Prisma Client
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    try {
      // Fetch all car brands along with their spare parts
      const carBrands = await prisma.carBrand.findMany({
        include: {
          spareParts: true, // Include associated spare parts
        },
      });

      res.status(200).json(carBrands);
    } catch (error) {
      console.error('Error fetching car brands:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
