import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma';

@Injectable()
export class UsersService {
  async findAll() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });
    return users;
  }
}
