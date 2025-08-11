import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { ImageUploadController } from "./controllers/image-upload.controller";
import { Product, ProductSchema } from "./schemas/product.schema";
import { CategoriesModule } from "../categories/categories.module";
import { CloudinaryService } from "./services/cloudinary.service";
import { DynamicFilesInterceptor } from "./interceptors/dynamic-files.interceptor";
import { Tags, TagsSchema } from "./schemas/tags.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema, },
      { name: Tags.name, schema: TagsSchema }
    ]),
    CategoriesModule,
  ],
  controllers: [ProductsController, ImageUploadController],
  providers: [ProductsService, CloudinaryService, DynamicFilesInterceptor],
  exports: [CloudinaryService],
})
export class ProductsModule { }
