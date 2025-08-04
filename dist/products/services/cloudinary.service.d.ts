import { ConfigService } from "@nestjs/config";
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<string>;
    uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]>;
    deleteImage(publicId: string): Promise<void>;
}
