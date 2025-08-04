"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicFilesInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const multer = require("multer");
let DynamicFilesInterceptor = class DynamicFilesInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const colors = request.body.colors;
        if (!colors || !Array.isArray(colors)) {
            throw new common_1.BadRequestException('Colors array is required');
        }
        const fields = colors.map(color => ({ name: color, maxCount: 10 }));
        const upload = multer().fields(fields);
        return new rxjs_1.Observable(observer => {
            upload(request, {}, (err) => {
                if (err) {
                    observer.error(new common_1.BadRequestException('File upload failed'));
                    return;
                }
                const colorFiles = {};
                for (const color of colors) {
                    const files = request.files?.[color];
                    if (files && files.length > 0) {
                        colorFiles[color] = Array.isArray(files) ? files : [files];
                    }
                    else {
                        colorFiles[color] = [];
                    }
                }
                request['colorFiles'] = colorFiles;
                next.handle().subscribe({
                    next: (value) => observer.next(value),
                    error: (error) => observer.error(error),
                    complete: () => observer.complete(),
                });
            });
        });
    }
};
exports.DynamicFilesInterceptor = DynamicFilesInterceptor;
exports.DynamicFilesInterceptor = DynamicFilesInterceptor = __decorate([
    (0, common_1.Injectable)()
], DynamicFilesInterceptor);
//# sourceMappingURL=dynamic-files.interceptor.js.map