import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  BadRequestException,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  FilesInterceptor,
  FileFieldsInterceptor,
} from "@nestjs/platform-express";
import { CloudinaryService } from "../services/cloudinary.service";
import {
  UploadImagesDto,
  UploadImagesResponseDto,
} from "../dto/upload-images.dto";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("upload")
export class ImageUploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post("images")
  @UseInterceptors(FilesInterceptor("files", 50)) // Allow up to 50 images total
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadImagesDto: UploadImagesDto,
    @Req() request: Request
  ): Promise<UploadImagesResponseDto> {
    if (!uploadImagesDto.colors || uploadImagesDto.colors.length === 0) {
      throw new BadRequestException("Colors array is required");
    }

    if (!files || files.length === 0) {
      throw new BadRequestException("No images provided");
    }

    try {
      const result: UploadImagesResponseDto = {};

      // Process each color in the colors array
      for (const color of uploadImagesDto.colors) {
        // Get files for this specific color from the request
        const colorFiles = request.body[color];

        if (!colorFiles) {
          // Skip if no files for this color
          result[color] = [];
          continue;
        }

        // Convert string array to file array
        const fileIndices = Array.isArray(colorFiles)
          ? colorFiles
              .map((index) => parseInt(index))
              .filter((index) => !isNaN(index))
          : [parseInt(colorFiles)].filter((index) => !isNaN(index));

        // Get actual files based on indices
        const actualFiles = fileIndices
          .map((index) => files[index])
          .filter((file) => file !== undefined);

        if (actualFiles.length > 0) {
          const urls =
            await this.cloudinaryService.uploadMultipleImages(actualFiles);
          result[color] = urls;
        } else {
          result[color] = [];
        }
      }

      return result;
    } catch (error) {
      throw new BadRequestException("Failed to upload images");
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("images-v2")
  @UseInterceptors(FilesInterceptor("files", 100)) // Allow up to 100 images total
  async uploadImagesV2(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadImagesDto: UploadImagesDto,
    @Req() request: Request
  ): Promise<UploadImagesResponseDto> {
    if (!uploadImagesDto.colors || uploadImagesDto.colors.length === 0) {
      throw new BadRequestException("Colors array is required");
    }

    if (!files || files.length === 0) {
      throw new BadRequestException("No images provided");
    }

    try {
      const result: UploadImagesResponseDto = {};

      // Process each color in the colors array
      for (const color of uploadImagesDto.colors) {
        // Get file indices for this color from the request body
        const colorFileIndices = request.body[color];

        if (!colorFileIndices) {
          // Skip if no files for this color
          result[color] = [];
          continue;
        }

        // Convert to array of indices
        const indices = Array.isArray(colorFileIndices)
          ? colorFileIndices
              .map((index) => parseInt(index))
              .filter((index) => !isNaN(index))
          : [parseInt(colorFileIndices)].filter((index) => !isNaN(index));

        // Get actual files based on indices
        const colorFiles = indices
          .map((index) => files[index])
          .filter((file) => file !== undefined);

        if (colorFiles.length > 0) {
          const urls =
            await this.cloudinaryService.uploadMultipleImages(colorFiles);
          result[color] = urls;
        } else {
          result[color] = [];
        }
      }

      return result;
    } catch (error) {
      throw new BadRequestException("Failed to upload images");
    }
  }

  @Post("images-v3")
  @UseInterceptors(FilesInterceptor("files", 100)) // Allow up to 100 images total
  async uploadImagesV3(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadImagesDto: UploadImagesDto,
    @Req() request: Request
  ): Promise<UploadImagesResponseDto> {
    if (!uploadImagesDto.colors || uploadImagesDto.colors.length === 0) {
      throw new BadRequestException("Colors array is required");
    }

    if (!files || files.length === 0) {
      throw new BadRequestException("No images provided");
    }

    try {
      const result: UploadImagesResponseDto = {};

      // Process each color in the colors array
      for (const color of uploadImagesDto.colors) {
        // Get file indices for this color from the request body
        const colorFileIndices = request.body[color];

        if (!colorFileIndices) {
          // Skip if no files for this color
          result[color] = [];
          continue;
        }

        // Convert to array of indices
        const indices = Array.isArray(colorFileIndices)
          ? colorFileIndices
              .map((index) => parseInt(index))
              .filter((index) => !isNaN(index))
          : [parseInt(colorFileIndices)].filter((index) => !isNaN(index));

        // Get actual files based on indices
        const colorFiles = indices
          .map((index) => files[index])
          .filter((file) => file !== undefined);

        if (colorFiles.length > 0) {
          const urls =
            await this.cloudinaryService.uploadMultipleImages(colorFiles);
          result[color] = urls;
        } else {
          result[color] = [];
        }
      }

      return result;
    } catch (error) {
      throw new BadRequestException("Failed to upload images");
    }
  }

  // Legacy endpoint for backward compatibility
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("images-legacy")
  @UseInterceptors(FilesInterceptor("images", 10))
  async uploadImagesLegacy(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any
  ): Promise<any> {
    if (!files || files.length === 0) {
      throw new BadRequestException("No images provided");
    }

    if (!body.color) {
      throw new BadRequestException("Color is required");
    }

    try {
      const urls = await this.cloudinaryService.uploadMultipleImages(files);

      return {
        color: body.color,
        urls,
      };
    } catch (error) {
      throw new BadRequestException("Failed to upload images");
    }
  }
}
