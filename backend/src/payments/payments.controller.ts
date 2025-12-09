import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Session() session: UserSession,
  ) {
    return this.paymentsService.create(createPaymentDto, session.user.id);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Patch(':id/paid')
  markAsPaid(@Param('id') id: string) {
    return this.paymentsService.markAsPaid(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: CreatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }
}
