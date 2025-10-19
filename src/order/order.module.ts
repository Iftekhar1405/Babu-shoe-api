import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./schemas/order.schema";
import { User, UserSchema } from "src/users/schemas/user.schemas";
import { PaymentModule } from "src/payment/payment.module";
import { CustomerModule } from "src/customer/customer.module";
import { TransactionModule } from "src/transaction/transaction.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PaymentModule,
    CustomerModule,
    TransactionModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
