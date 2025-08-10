import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Bill, BillSchema } from "./schemas/billing.schemas";
import { Product, ProductSchema } from "src/products/schemas/product.schema";
import { BillService } from "./billings.services";
import { BillController } from "./billings.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bill.name, schema: BillSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService],
})
export class BillModule {}
