import { Module } from '@nestjs/common';
import { CompanyService } from './companies.service';
import { CompanyController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }])],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule { }
