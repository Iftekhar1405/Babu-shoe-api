import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoriesModule } from "./categories/categories.module";
import { ProductsModule } from "./products/products.module";
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        "mongodb+srv://iftekharahmedxyz:helloworld@cluster0.uleqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    ),
    CategoriesModule,
    ProductsModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
