import { Module } from "@nestjs/common";
import { BillService } from "./billings.service";
import { BillController } from "./billings.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Bill, BillSchema } from "./schemas/billing.schemas";
import { Product, ProductSchema } from "src/products/schemas/product.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bill.name, schema: BillSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [BillController],
  providers: [BillService],
})
export class BillingsModule {}
