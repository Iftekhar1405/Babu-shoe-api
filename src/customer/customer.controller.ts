import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './schema/customer.schema';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Get()
  async getAll() {
    return await this.customerService.getAll()
  }

  @Post()
  async create(@Body() data: Partial<Customer>) {
    return await this.customerService.create(data)
  }

  @Get('contact')
  async findByContact(@Query('contact') contact: string) {
    return await this.customerService.findByContact(contact)
  }
}
