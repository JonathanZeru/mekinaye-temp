import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'Dj2T1oa2nzx0ndBQ6LRfRiGjAyL4vfipve2PCGBwZl8=';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
      const userId = decoded.id;

      const { id } = req.query;
      const { firstName, lastName, userName, password, type } = req.body;

      // Check if the user is authorized to update the specified user
      if (Number(id) !== userId) {
        return res.status(403).json({ error: 'Not authorized to update this user' });
      }

      // Prepare the update data
      const updateData: {
        firstName?: string;
        lastName?: string;
        userName?: string;
        password?: string;
        type?: string;
      } = {};

      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (userName) updateData.userName = userName;

      if (password) {
        // Hash the new password before updating
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      if (type) updateData.type = type;

      // Perform the update operation
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData
      });

      res.status(200).json({
        message: 'Update successful',
        data: updatedUser
      });
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
