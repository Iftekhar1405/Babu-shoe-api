import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { BillService } from "./billings.service";
import { Bill } from "./schemas/billing.schemas";
import { CreateBillDto } from "./dto/create-bill.dto";
import { ApiResponse } from "./types";

@Controller("bills")
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  async createBill(
    @Body() createBillDto: CreateBillDto
  ): Promise<ApiResponse<Bill>> {
    const bill = await this.billService.createBill(createBillDto);
    return {
      success: true,
      message: "Bill createed.",
      data: bill,
    };
  }

  @Get()
  async getAllBills(): Promise<Bill[]> {
    return this.billService.getAllBills();
  }

  @Get(":id")
  async getBillById(@Param("id") id: string): Promise<Bill> {
    return this.billService.getBillById(id);
  }

  @Patch(":id")
  async updateBill(
    @Param("id") id: string,
    @Body() updateData: Partial<CreateBillDto>
  ): Promise<Bill> {
    return this.billService.updateBill(id, updateData);
  }

  @Delete(":id")
  async deleteBill(@Param("id") id: string): Promise<{ message: string }> {
    return this.billService.deleteBill(id);
  }
}
