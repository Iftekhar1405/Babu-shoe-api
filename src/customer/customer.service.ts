import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './schema/customer.schema';
import { ClientSession, Model } from 'mongoose';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name)
        private readonly customerModel: Model<CustomerDocument>
    ) { }

    async getAll() {
        return await this.customerModel.find().populate('userId').lean(true)
    }

    async create(data: Partial<Customer>, session?: ClientSession) {
        if (data.contact && !data.contact.startsWith('+91')) {
            data.contact = '+91' + data.contact;
        }
        const customer = await this.customerModel.create([data], { session });
        return customer[0]
    }


    async findByContact(contact: string, session?: ClientSession) {
        const fullContact = '+91' + contact
        const customer = await this.customerModel.findOne({ contact: fullContact }).populate('userId').session(session).lean(true)
        return customer
    }

}
