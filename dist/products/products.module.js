"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
const image_upload_controller_1 = require("./controllers/image-upload.controller");
const tags_controller_1 = require("./controllers/tags.controller");
const product_schema_1 = require("./schemas/product.schema");
const categories_module_1 = require("../categories/categories.module");
const cloudinary_service_1 = require("./services/cloudinary.service");
const tags_service_1 = require("./services/tags.service");
const dynamic_files_interceptor_1 = require("./interceptors/dynamic-files.interceptor");
const company_schema_1 = require("../company/schemas/company.schema");
const tags_schema_1 = require("./schemas/tags.schema");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: company_schema_1.Company.name, schema: company_schema_1.CompanySchema },
                { name: tags_schema_1.Tags.name, schema: tags_schema_1.TagSchema },
            ]),
            categories_module_1.CategoriesModule,
        ],
        controllers: [products_controller_1.ProductsController, image_upload_controller_1.ImageUploadController, tags_controller_1.TagsController],
        providers: [
            products_service_1.ProductsService,
            cloudinary_service_1.CloudinaryService,
            tags_service_1.TagsService,
            dynamic_files_interceptor_1.DynamicFilesInterceptor,
        ],
        exports: [cloudinary_service_1.CloudinaryService, tags_service_1.TagsService],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map