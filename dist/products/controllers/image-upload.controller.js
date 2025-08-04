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
exports.ImageUploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("../services/cloudinary.service");
const upload_images_dto_1 = require("../dto/upload-images.dto");
let ImageUploadController = class ImageUploadController {
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }
    async uploadImages(files, uploadImagesDto, request) {
        if (!uploadImagesDto.colors || uploadImagesDto.colors.length === 0) {
            throw new common_1.BadRequestException("Colors array is required");
        }
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException("No images provided");
        }
        try {
            const result = {};
            for (const color of uploadImagesDto.colors) {
                const colorFiles = request.body[color];
                if (!colorFiles) {
                    result[color] = [];
                    continue;
                }
                const fileIndices = Array.isArray(colorFiles)
                    ? colorFiles
                        .map((index) => parseInt(index))
                        .filter((index) => !isNaN(index))
                    : [parseInt(colorFiles)].filter((index) => !isNaN(index));
                const actualFiles = fileIndices
                    .map((index) => files[index])
                    .filter((file) => file !== undefined);
                if (actualFiles.length > 0) {
                    const urls = await this.cloudinaryService.uploadMultipleImages(actualFiles);
                    result[color] = urls;
                }
                else {
                    result[color] = [];
                }
            }
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to upload images");
        }
    }
    async uploadImagesV2(files, uploadImagesDto, request) {
        console.log("🪵 ~ ImageUploadController ~ uploadImagesV2 ~ uploadImagesDto:", uploadImagesDto);
        if (!uploadImagesDto.colors || uploadImagesDto.colors.length === 0) {
            throw new common_1.BadRequestException("Colors array is required");
        }
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException("No images provided");
        }
        try {
            const result = {};
            for (const color of uploadImagesDto.colors) {
                const colorFileIndices = request.body[color];
                if (!colorFileIndices) {
                    result[color] = [];
                    continue;
                }
                const indices = Array.isArray(colorFileIndices)
                    ? colorFileIndices
                        .map((index) => parseInt(index))
                        .filter((index) => !isNaN(index))
                    : [parseInt(colorFileIndices)].filter((index) => !isNaN(index));
                const colorFiles = indices
                    .map((index) => files[index])
                    .filter((file) => file !== undefined);
                if (colorFiles.length > 0) {
                    const urls = await this.cloudinaryService.uploadMultipleImages(colorFiles);
                    result[color] = urls;
                }
                else {
                    result[color] = [];
                }
            }
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to upload images");
        }
    }
    async uploadImagesV3(files, uploadImagesDto, request) {
        if (!uploadImagesDto.colors || uploadImagesDto.colors.length === 0) {
            throw new common_1.BadRequestException("Colors array is required");
        }
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException("No images provided");
        }
        try {
            const result = {};
            for (const color of uploadImagesDto.colors) {
                const colorFileIndices = request.body[color];
                if (!colorFileIndices) {
                    result[color] = [];
                    continue;
                }
                const indices = Array.isArray(colorFileIndices)
                    ? colorFileIndices
                        .map((index) => parseInt(index))
                        .filter((index) => !isNaN(index))
                    : [parseInt(colorFileIndices)].filter((index) => !isNaN(index));
                const colorFiles = indices
                    .map((index) => files[index])
                    .filter((file) => file !== undefined);
                if (colorFiles.length > 0) {
                    const urls = await this.cloudinaryService.uploadMultipleImages(colorFiles);
                    result[color] = urls;
                }
                else {
                    result[color] = [];
                }
            }
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to upload images");
        }
    }
    async uploadImagesLegacy(files, body) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException("No images provided");
        }
        if (!body.color) {
            throw new common_1.BadRequestException("Color is required");
        }
        try {
            const urls = await this.cloudinaryService.uploadMultipleImages(files);
            return {
                color: body.color,
                urls,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to upload images");
        }
    }
};
exports.ImageUploadController = ImageUploadController;
__decorate([
    (0, common_1.Post)("images"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files", 50)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, upload_images_dto_1.UploadImagesDto, Object]),
    __metadata("design:returntype", Promise)
], ImageUploadController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Post)("images-v2"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files", 100)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, upload_images_dto_1.UploadImagesDto, Object]),
    __metadata("design:returntype", Promise)
], ImageUploadController.prototype, "uploadImagesV2", null);
__decorate([
    (0, common_1.Post)("images-v3"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files", 100)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, upload_images_dto_1.UploadImagesDto, Object]),
    __metadata("design:returntype", Promise)
], ImageUploadController.prototype, "uploadImagesV3", null);
__decorate([
    (0, common_1.Post)("images-legacy"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("images", 10)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ImageUploadController.prototype, "uploadImagesLegacy", null);
exports.ImageUploadController = ImageUploadController = __decorate([
    (0, common_1.Controller)("upload"),
    __metadata("design:paramtypes", [cloudinary_service_1.CloudinaryService])
], ImageUploadController);
//# sourceMappingURL=image-upload.controller.js.map