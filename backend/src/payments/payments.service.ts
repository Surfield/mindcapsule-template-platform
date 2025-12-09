import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  async create(createPaymentDto: CreatePaymentDto, userId: string) {
    const payment = await prisma.payment.create({
      data: {
        date: new Date(createPaymentDto.date),
        time: createPaymentDto.time,
        name: createPaymentDto.name,
        amount: createPaymentDto.amount,
        createdById: userId,
      },
    });
    return payment;
  }

  async findAll() {
    const payments = await prisma.payment.findMany({
      where: { paid: false },
      orderBy: [{ date: 'desc' }, { time: 'desc' }],
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return payments;
  }

  async markAsPaid(id: string) {
    const payment = await prisma.payment.update({
      where: { id },
      data: { paid: true },
    });
    return payment;
  }

  async update(id: string, updatePaymentDto: CreatePaymentDto) {
    const payment = await prisma.payment.update({
      where: { id },
      data: {
        date: new Date(updatePaymentDto.date),
        time: updatePaymentDto.time,
        name: updatePaymentDto.name,
        amount: updatePaymentDto.amount,
      },
    });
    return payment;
  }
}
