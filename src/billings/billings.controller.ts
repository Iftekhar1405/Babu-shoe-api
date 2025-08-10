import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BillService } from './billings.services';
import { CreateBillDto } from './dto/add-to-bill.dto';


@Controller('bill')
@UseGuards(JwtAuthGuard)
export class BillController {
  constructor(private readonly cartService: BillService) {}

  @Post('add')
  async addToCart(@Body() createBillDto: CreateBillDto, @Req() req: any) {
    const userId = req.user.id; 
    return await this.cartService.addToCart(userId, createBillDto);
  }

  @Get()
  async getCart(@Req() req: any) {
    const userId = req.user.id;
    return await this.cartService.getBill(userId);
  }
}