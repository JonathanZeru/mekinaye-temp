import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid or missing advertisement ID' });
    }

    try {
      // Find the advertisement by ID
      const ad = await prisma.advertisement.findUnique({
        where: { id: parseInt(id as string) },
      });

      if (!ad) {
        return res.status(404).json({ error: 'Advertisement not found' });
      }

      // Delete the advertisement from the database
      await prisma.advertisement.delete({
        where: { id: parseInt(id as string) },
      });

      res.status(200).json({
        message: "Advertisement deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
