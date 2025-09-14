import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './schema/customer.schema';
import { Model } from 'mongoose';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name)
        private readonly customerModel: Model<CustomerDocument>
    ) { }

    async getAll() {
        return await this.customerModel.find().lean(true)
    }

    async create(data: Partial<Customer>) {
        return await this.customerModel.create(data)
    }

    async findByContact(contact: string) {
        const fullContact = '+91' + contact

        return await this.customerModel.findOne({ contact: fullContact }).lean(true)
    }

}
