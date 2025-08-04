export declare class UploadImagesDto {
    colors: string[];
}
export declare class ColorImageUploadDto {
    images?: Express.Multer.File[];
}
export declare class UploadImagesResponseDto {
    [color: string]: string[];
}
