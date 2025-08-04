import { CloudinaryService } from "../services/cloudinary.service";
import { UploadImagesDto, UploadImagesResponseDto } from "../dto/upload-images.dto";
import { Request } from "express";
export declare class ImageUploadController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadImages(files: Express.Multer.File[], uploadImagesDto: UploadImagesDto, request: Request): Promise<UploadImagesResponseDto>;
    uploadImagesV2(files: Express.Multer.File[], uploadImagesDto: UploadImagesDto, request: Request): Promise<UploadImagesResponseDto>;
    uploadImagesV3(files: Express.Multer.File[], uploadImagesDto: UploadImagesDto, request: Request): Promise<UploadImagesResponseDto>;
    uploadImagesLegacy(files: Express.Multer.File[], body: any): Promise<any>;
}
