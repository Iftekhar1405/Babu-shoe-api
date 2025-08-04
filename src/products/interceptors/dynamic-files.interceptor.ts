import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import * as multer from 'multer';

export interface ColorFiles {
  [color: string]: Express.Multer.File[];
}

@Injectable()
export class DynamicFilesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Get colors from the request body
    const colors = request.body.colors;
    
    if (!colors || !Array.isArray(colors)) {
      throw new BadRequestException('Colors array is required');
    }

    // Create dynamic multer fields configuration
    const fields = colors.map(color => ({ name: color, maxCount: 10 }));
    
    // Create multer instance with dynamic fields
    const upload = multer().fields(fields);
    
    return new Observable(observer => {
      upload(request as any, {} as any, (err) => {
        if (err) {
          observer.error(new BadRequestException('File upload failed'));
          return;
        }

        // Process uploaded files
        const colorFiles: ColorFiles = {};
        
        for (const color of colors) {
          const files = (request.files as any)?.[color];
          if (files && files.length > 0) {
            colorFiles[color] = Array.isArray(files) ? files : [files];
          } else {
            colorFiles[color] = [];
          }
        }

        // Attach processed files to request
        request['colorFiles'] = colorFiles;

        next.handle().subscribe({
          next: (value) => observer.next(value),
          error: (error) => observer.error(error),
          complete: () => observer.complete(),
        });
      });
    });
  }
} 