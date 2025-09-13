import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { IncomingOrder } from './schema/incoming-order.schema';

@Injectable()
export class IncomingOrdersService {
    constructor(
        @InjectModel(IncomingOrder.name) private orderModel: Model<IncomingOrder>,
    ) { }

    async create(createOrderDto: CreateOrderDto): Promise<IncomingOrder> {
        const newOrder = new this.orderModel(createOrderDto);
        return newOrder.save();
    }

    async findAll(): Promise<IncomingOrder[]> {
        return await this.orderModel.find().populate('vendorId matchedBy comments.user').exec();
    }

    async findOne(id: string): Promise<IncomingOrder> {
        const order = await this.orderModel.findById(id).populate('vendorId matchedBy comments.user').exec();
        if (!order) throw new NotFoundException('IncomingOrder not found');
        return order;
    }

    async update(id: string, updateData: Partial<CreateOrderDto>): Promise<IncomingOrder> {
        const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updatedOrder) throw new NotFoundException('IncomingOrder not found');
        return updatedOrder;
    }

    async delete(id: string): Promise<void> {
        const result = await this.orderModel.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('IncomingOrder not found');
    }
}
