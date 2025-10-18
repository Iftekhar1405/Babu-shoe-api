import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoriesModule } from "./categories/categories.module";
import { ProductsModule } from "./products/products.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { UsersService } from "./users/users.service";
import { OrderModule } from "./order/order.module";
import { BillModule } from "./billings/billings.module";
import { CompanyModule } from "./company/companies.module";
import { OpenaiModule } from "./openai/openai.module";
import { WhatsappService } from "./whatsapp/whatsapp.service";
import { WhatsappController } from "./whatsapp/whatsapp.controller";
import { PaymentModule } from "./payment/payment.module";
import { IncomingOrdersModule } from './incoming-orders/incoming-orders.module';
import { VendorsModule } from './vendors/vendors.module';
import { CustomerModule } from './customer/customer.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    PaymentModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrderModule,
    BillModule,
    CompanyModule,
    OpenaiModule,
    IncomingOrdersModule,
    IncomingOrdersModule,
    VendorsModule,
    CustomerModule,
    TransactionModule,
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class AppModule {
  constructor(private usersService: UsersService) { }

  // async onModuleInit() {
  //   try {
  //     await this.usersService.createAdminUser();
  //     console.log("✅ Default admin user created/verified");
  //   } catch (error) {
  //     console.error("❌ Error creating admin user:", error.message);
  //   }
  // }
}
