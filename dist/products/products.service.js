"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const categories_service_1 = require("../categories/categories.service");
let ProductsService = class ProductsService {
    constructor(productModel, categoriesService) {
        this.productModel = productModel;
        this.categoriesService = categoriesService;
    }
    async findAll(categoryId, search, companyId) {
        const filter = {};
        if (categoryId) {
            filter.categoryId = new mongoose_2.Types.ObjectId(categoryId);
        }
        if (companyId) {
            filter.companyId = new mongoose_2.Types.ObjectId(companyId);
        }
        if (search) {
            const pipeline = [
                {
                    $lookup: {
                        from: 'tags',
                        localField: 'tags',
                        foreignField: '_id',
                        as: 'tagDetails'
                    }
                },
                {
                    $match: {
                        $and: [
                            ...(categoryId ? [{ categoryId: new mongoose_2.Types.ObjectId(categoryId) }] : []),
                            ...(companyId ? [{ companyId: new mongoose_2.Types.ObjectId(companyId) }] : []),
                            {
                                $or: [
                                    { name: { $regex: search, $options: 'i' } },
                                    { articleNo: { $regex: search, $options: 'i' } },
                                    { description: { $regex: search, $options: 'i' } },
                                    { 'tagDetails.name': { $regex: search, $options: 'i' } }
                                ]
                            }
                        ]
                    }
                },
                { $sort: { createdAt: -1 } },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'categoryId'
                    }
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'companyId',
                        foreignField: '_id',
                        as: 'companyId'
                    }
                },
                {
                    $unwind: {
                        path: '$categoryId',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$companyId',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        tags: '$tagDetails'
                    }
                },
                {
                    $project: {
                        tagDetails: 0
                    }
                }
            ];
            return await this.productModel.aggregate(pipeline).exec();
        }
        return await this.productModel
            .find(filter)
            .populate('categoryId')
            .populate('companyId')
            .populate('tags')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const product = await this.productModel
            .findById(id)
            .populate('categoryId')
            .populate('companyId')
            .populate('tags')
            .exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async create(createProductDto) {
        await this.categoriesService.findOne(createProductDto.categoryId);
        const existingProduct = await this.productModel.findOne({
            articleNo: createProductDto.articleNo
        });
        if (existingProduct) {
            throw new common_1.ConflictException('Product with this article number already exists');
        }
        const productData = {
            ...createProductDto,
            companyId: createProductDto.companyId ? new mongoose_2.Types.ObjectId(createProductDto.companyId) : undefined,
            tags: createProductDto.tags?.map(tagId => new mongoose_2.Types.ObjectId(tagId)),
            categoryId: new mongoose_2.Types.ObjectId(createProductDto.categoryId),
        };
        const createdProduct = new this.productModel(productData);
        const savedProduct = await createdProduct.save();
        return await this.productModel
            .findById(savedProduct._id)
            .populate('categoryId')
            .populate('companyId')
            .populate('tags')
            .exec();
    }
    async update(id, updateProductDto) {
        const existingProduct = await this.productModel.findById(id);
        if (!existingProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (updateProductDto.categoryId) {
            await this.categoriesService.findOne(updateProductDto.categoryId);
        }
        if (updateProductDto.articleNo) {
            const duplicateProduct = await this.productModel.findOne({
                articleNo: updateProductDto.articleNo,
                _id: { $ne: id }
            });
            if (duplicateProduct) {
                throw new common_1.ConflictException('Product with this article number already exists');
            }
        }
        const updateData = {
            ...updateProductDto,
            ...(updateProductDto.companyId && { companyId: new mongoose_2.Types.ObjectId(updateProductDto.companyId) }),
            ...(updateProductDto.tags && { tags: updateProductDto.tags.map(tagId => new mongoose_2.Types.ObjectId(tagId)) }),
            ...(updateProductDto.categoryId && { categoryId: new mongoose_2.Types.ObjectId(updateProductDto.categoryId) }),
        };
        const updatedProduct = await this.productModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('categoryId')
            .populate('companyId')
            .populate('tags')
            .exec();
        return updatedProduct;
    }
    async remove(id) {
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
    }
    async findByCategory(categoryId) {
        return await this.productModel
            .find({ categoryId: new mongoose_2.Types.ObjectId(categoryId) })
            .populate('categoryId')
            .populate('companyId')
            .populate('tags')
            .exec();
    }
    async findByCompany(companyId) {
        return await this.productModel
            .find({ companyId: new mongoose_2.Types.ObjectId(companyId) })
            .populate('categoryId')
            .populate('companyId')
            .populate('tags')
            .exec();
    }
    async findByTags(tagIds) {
        const objectIdTags = tagIds.map(tagId => new mongoose_2.Types.ObjectId(tagId));
        return await this.productModel
            .find({ tags: { $in: objectIdTags } })
            .populate('categoryId')
            .populate('companyId')
            .populate('tags')
            .exec();
    }
    async getProductsCount() {
        return await this.productModel.countDocuments();
    }
    async toggleStock(id) {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        product.inStock = !product.inStock;
        await product.save();
        return await this.productModel
            .findById(id)
            .populate('categoryId')
            .populate('companyId')
            .populate('tags')
            .exec();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        categories_service_1.CategoriesService])
], ProductsService);
//# sourceMappingURL=products.service.js.map