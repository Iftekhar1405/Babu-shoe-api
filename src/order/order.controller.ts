import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // path may vary
// import { User } from 'src/common/decorators/user.decorator'; // custom decorator
import { Types } from "mongoose";
import { AuthenticatedRequest } from "src/billings/types";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("orders")
@UseGuards(JwtAuthGuard)
// @UseGuards(JwtAuthGuard) // ✅ Apply guard globally to this controller
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: AuthenticatedRequest
  ) {
    const id = req.user.id;
    return this.orderService.create(createOrderDto, id);
  }

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.orderService.remove(id);
  }
}
