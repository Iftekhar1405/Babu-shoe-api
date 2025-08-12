import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoriesModule } from "./categories/categories.module";
import { ProductsModule } from "./products/products.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { UsersService } from "./users/users.service";
import { OrderModule } from "./order/order.module";
import { BillModule } from "./billings/billings.module";
import { CompanyModule } from './company/companies.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongooseModule.forRoot(
    //   process.env.MONGODB_URI ||
    //     ""
    // ),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrderModule,
    BillModule,
    CompanyModule,
    CompanyModule,
    OpenaiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private usersService: UsersService) { }

  async onModuleInit() {
    // Create default admin user on application startup
    try {
      await this.usersService.createAdminUser();
      console.log("✅ Default admin user created/verified");
    } catch (error) {
      console.error("❌ Error creating admin user:", error.message);
    }
  }
}
