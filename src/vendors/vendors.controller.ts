import { Body, Controller, Get, Post } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { Vendor } from './schema/vendor.schema';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) { }

  @Get()
  async getAll() {
    return await this.vendorsService.getAll()
  }

  @Post()
  async create(@Body() data: Partial<Vendor>) {
    return await this.vendorsService.create(data)
  }

}
