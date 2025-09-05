import { IsInt, IsOptional, IsString, Min } from 'class-validator';


export class PaginationQueryDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    count?: number; // default 10


    @IsOptional()
    @IsInt()
    @Min(0)
    skip?: number; // default 0


    @IsOptional()
    @IsString()
    from?: string; // ISO or timestamp


    @IsOptional()
    @IsString()
    to?: string; // ISO or timestamp
}