import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password, status, userName, phoneNumber, type } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          status,
          userName,
          phoneNumber,
          type,
        },
      });

      res.status(201).json({
        message: 'Registration successful',
        data: newUser,
      });
    } catch (error) {
      console.error('Error occurred during user registration:', error);
      res.status(500).json({ error: 'Internal Server Errorrr' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
