import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IncomingOrder, IncomingOrderSchema } from "./schema/incoming-order.schema";
import { IncomingOrdersController } from "./incoming-orders.controller";
import { IncomingOrdersService } from "./incoming-orders.service";


@Module({
  imports: [MongooseModule.forFeature([{ name: IncomingOrder.name, schema: IncomingOrderSchema }])],
  controllers: [IncomingOrdersController],
  providers: [IncomingOrdersService],
})
export class IncomingOrdersModule { }
