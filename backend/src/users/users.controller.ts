import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminGuard } from '../guards/admin.guard';

@Controller('users')
@UseGuards(AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
