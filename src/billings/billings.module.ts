import { Module } from "@nestjs/common";
import { BillService } from "./billings.service";
import { BillController } from "./billings.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Bill, BillSchema } from "./schemas/billing.schemas";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
  ],
  controllers: [BillController],
  providers: [BillService],
})
export class BillingsModule {}
