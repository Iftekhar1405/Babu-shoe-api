import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { ImageUploadController } from "./controllers/image-upload.controller";
import { TagsController } from "./controllers/tags.controller";
import { Product, ProductSchema } from "./schemas/product.schema";
import { CategoriesModule } from "../categories/categories.module";
import { CloudinaryService } from "./services/cloudinary.service";
import { TagsService } from "./services/tags.service";
import { DynamicFilesInterceptor } from "./interceptors/dynamic-files.interceptor";
import { Company, CompanySchema } from "../company/schemas/company.schema";
import { Tags, TagSchema } from "./schemas/tags.schema";
import { OpenaiModule } from "src/openai/openai.module";
import { CompanyModule } from "src/company/companies.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Tags.name, schema: TagSchema },
    ]),
    CategoriesModule,
    OpenaiModule,
  ],
  controllers: [ProductsController, ImageUploadController, TagsController],
  providers: [
    ProductsService,
    CloudinaryService,
    TagsService,
    DynamicFilesInterceptor,
  ],
  exports: [CloudinaryService, TagsService],
})
export class ProductsModule { }
