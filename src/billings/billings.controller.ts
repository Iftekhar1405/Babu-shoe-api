import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Patch,
  Delete,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { BillService } from "./billings.services";
import { AuthenticatedRequest } from "src/common/enums/types";
import { UpdateBillItemDto } from "./dto/update-bill-dto";
import { RemoveBillItemDto } from "./dto/remove-bill.dto";
import { ProductDetail } from "./schemas/billing.schemas";

@Controller("bill")
@UseGuards(JwtAuthGuard)
export class BillController {
  constructor(private readonly billService: BillService) { }

  @Post("add")
  async addToCart(
    @Body() createBillDto: ProductDetail,
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

  @Patch("update-item")
  async updateBillItem(
    @Body() updateBillItemDto: UpdateBillItemDto,
    @Req() req: AuthenticatedRequest
  ) {
    const userId = req.user.id;
    return await this.billService.updateBillItem(userId, updateBillItemDto);
  }

  @Delete('remove-item')
  async removeBillItem(
    @Body() removeBillItemDto: RemoveBillItemDto,
    @Req() req: AuthenticatedRequest
  ) {
    const userId = req.user.id;
    return await this.billService.removeBillItem(userId, removeBillItemDto);
  }
}
