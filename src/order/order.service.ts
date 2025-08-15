import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order, OrderDocument } from "./schemas/order.schema";
import { User, UserDocument } from "src/users/schemas/user.schemas";
import { AuthenticatedRequest } from "src/billings/types";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async create(createOrderDto: CreateOrderDto, id: string): Promise<Order> {
    // Get the last order (sorted by orderNumber)
    const lastOrder = await this.orderModel
      .findOne({})
      .sort({ orderNumber: -1 })
      .select("orderNumber")
      .lean();

    const nextOrderNumber = lastOrder?.orderNumber
      ? lastOrder.orderNumber + 1
      : 1;

    const user = await this.userModel.findOne({ _id: new Types.ObjectId(id) });
    
    const isUserAdmin = user && user.role === "admin";
    
    const newOrder = new this.orderModel({
      ...createOrderDto,
      name: isUserAdmin ? createOrderDto.name : user.name || "Customer",
      user: new Types.ObjectId(user._id),
      orderNumber: nextOrderNumber,
    });

    const savedOrder = await newOrder.save();
  
  await savedOrder.populate({
    path: "productDetails.productId",
    select: "name articleNo -_id",
  });

  return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderModel
      .find()
      .populate("user")
      .populate("productDetails.productId")
      .populate("address")
      .populate("shippingPartner")
      .populate("comments.user")
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate("user")
      .populate("productDetails.productId")
      .populate("address")
      .populate("shippingPartner")
      .populate("comments.user")
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();

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
