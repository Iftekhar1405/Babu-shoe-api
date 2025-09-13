import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vendor, VendorSchema } from './schema/vendor.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }])],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule { }
