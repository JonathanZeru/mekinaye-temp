import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      // Fetch the car brand with the specified ID along with its spare parts
      const carBrand = await prisma.carBrand.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          spareParts: true, // Include associated spare parts
        },
      });

      if (carBrand) {
        res.status(200).json(carBrand.spareParts);
      } else {
        res.status(404).json({ error: 'Car brand not found' });
      }
    } catch (error) {
      console.error('Error fetching car brand spare parts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
