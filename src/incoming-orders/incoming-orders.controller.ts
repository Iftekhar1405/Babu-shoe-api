import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { IncomingOrdersService } from './incoming-orders.service';

@Controller('incoming-orders')
export class IncomingOrdersController {
  constructor(private readonly iIncomingOrderService: IncomingOrdersService) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.iIncomingOrderService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    return await this.iIncomingOrderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.iIncomingOrderService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateOrderDto>) {
    return this.iIncomingOrderService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.iIncomingOrderService.delete(id);
  }
}
