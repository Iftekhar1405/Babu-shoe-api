import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

export interface ColorFiles {
  [color: string]: Express.Multer.File[];
}

@Injectable()
export class MultipleFilesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const colors = request.body.colors;

    if (!colors || !Array.isArray(colors)) {
      throw new BadRequestException('Colors array is required');
    }

    // Process files for each color
    const colorFiles: ColorFiles = {};
    
    for (const color of colors) {
      const files = request.files?.[color] as Express.Multer.File[];
      if (files && files.length > 0) {
        colorFiles[color] = Array.isArray(files) ? files : [files];
      } else {
        colorFiles[color] = [];
      }
    }

    // Attach processed files to request
    request['colorFiles'] = colorFiles;

    return next.handle();
  }
} 