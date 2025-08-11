import { Controller, Post, Get, Body, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { BillService } from "./billings.services";
import { CreateBillDto } from "./dto/add-to-bill.dto";
import { AuthenticatedRequest } from "./types";

@Controller("bill")
@UseGuards(JwtAuthGuard)
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post("add")
  async addToCart(
    @Body() createBillDto: CreateBillDto,
    @Req() req: AuthenticatedRequest
  ) {
    const userId = req.user.id;
    return await this.billService.addToCart(userId, createBillDto);
  }

  @Get()
  async getCart(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return await this.billService.getBill(userId);
  }

  @Get("clear-all")
  async clearAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return await this.billService.clear(userId);
  }
}
