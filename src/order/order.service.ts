import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Get the last order (sorted by orderNumber)
    const lastOrder = await this.orderModel
      .findOne({})
      .sort({ orderNumber: -1 })
      .select('orderNumber')
      .lean();

    const nextOrderNumber = lastOrder?.orderNumber ? lastOrder.orderNumber + 1 : 1;

    const newOrder = new this.orderModel({
      ...createOrderDto,
      orderNumber: nextOrderNumber,
    });

    return await newOrder.save();
  }


  async findAll(): Promise<Order[]> {
    return await this.orderModel.find()
      .populate('user')
      .populate('productDetails.projectId')
      .populate('address')
      .populate('shippingPartner')
      .populate('comments.user')
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id)
      .populate('user')
      .populate('productDetails.projectId')
      .populate('address')
      .populate('shippingPartner')
      .populate('comments.user')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      updateOrderDto,
      { new: true },
    ).exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return updatedOrder;
  }

  async remove(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();

    if (!deletedOrder) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return deletedOrder;
  }
}
