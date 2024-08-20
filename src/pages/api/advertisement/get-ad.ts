import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';


// Initialize Prisma Client
const prisma = new PrismaClient();





export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    try {
      // Fetch all advertisements from the database
      const advertisements = await prisma.advertisement.findMany({
        orderBy: {
          createdAt: 'desc', // Sort by createdAt descending
        },
      });

      // Send the advertisements as a response
      res.status(200).json({
        message: "Advertisements fetched successfully",
        data: advertisements
      });
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
