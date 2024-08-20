import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userName, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { userName: userName },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, userName: user.userName, email: user.email },
        SECRET_KEY,
        { expiresIn: '1h' } 
      );

      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        message: 'Login successful',
        data: userWithoutPassword,
        accessToken: token,
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
