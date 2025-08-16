import { IsEnum, IsOptional, IsString } from "class-validator";
import { Order, ORDER_STATUS } from "../schemas/order.schema";

export interface OrderFiltersDto {
  search?: string;
  status?: string;
  mode?: string;
  paymentMode?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedOrderResponseDto {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderStatsDto {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

export class UpdateOrderStatusDto {
  @IsEnum(ORDER_STATUS)
  status: string;

  @IsOptional()
  @IsString()
  comment?: string;
}