import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vendor } from './schema/vendor.schema';
import { Model } from 'mongoose';

@Injectable()
export class VendorsService {
    constructor(
        @InjectModel(Vendor.name)
        private readonly vendorModel: Model<Vendor>
    ) { }

    async create(data: Partial<Vendor>) {
        return await this.vendorModel.create(data)
    }

    async getAll() {
        return await this.vendorModel.find().lean(true)
    }
}
