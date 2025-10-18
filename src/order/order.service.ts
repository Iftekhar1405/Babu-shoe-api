import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order, ORDER_MODE, ORDER_PAYMENT_STATUS, ORDER_STATUS, OrderDocument } from "./schemas/order.schema";
import { User, UserDocument } from "src/users/schemas/user.schemas";
import {
  OrderFiltersDto,
  OrderStatsDto,
  PaginatedOrderResponseDto,
  UpdateOrderStatusDto,
} from "./types";
import { PaymentService } from "src/payment/payment.service";
import { PaymentCurrency, PaymentStatus } from "./schemas/payment-info.enums";
import { CustomerService } from "src/customer/customer.service";
import { Role } from "src/common/enums/role.enum";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly paymentService: PaymentService,
    private readonly customerService: CustomerService,
  ) { }

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

    if (createOrderDto.mode == ORDER_MODE.offline) {
      createOrderDto.status = ORDER_STATUS.delivered
      // createOrderDto.paymentStatus = ORDER_PAYMENT_STATUS.Done
    }
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(id) });

    const isUserAdmin = user && user.role === Role.ADMIN;

    let customer = await this.customerService.findByContact(createOrderDto.phoneNumber)

    if (!customer) {
      const userData = { ...createOrderDto, phoneNumber: '+91' + createOrderDto.phoneNumber, password: (createOrderDto.phoneNumber + createOrderDto.name) }
      const user = await this.userModel.findOneAndUpdate({ phoneNumber: '+91' + createOrderDto.phoneNumber }, userData, { new: true, upsert: true, })

      const customerData = { contact: user.phoneNumber, userId: user._id.toString(), address: createOrderDto.address }
      customer = await this.customerService.create(customerData)
    }

    const newOrder = new this.orderModel({
      ...createOrderDto,
      name: isUserAdmin ? createOrderDto.name : user.name || "Customer",
      user: new Types.ObjectId(user._id),
      orderNumber: nextOrderNumber,
      customerId: customer._id
    });

    const savedOrder = await newOrder.save();

    await savedOrder.populate({
      path: "productDetails.productId",
      select: "name articleNo -_id",
    });

    return savedOrder;
  }

  async payForOrder(data: { orderId: string, id?: string }) {
    const order = await this.orderModel.findById(data.orderId).lean();
    if (!order) {
      throw new NotFoundException(`Order with id ${data.orderId} not found`);
    }

    const totalAmount = order.productDetails.reduce((sum, item) => {
      const discountFactor = 1 - (Number(item.discountPercent) || 0) / 100;
      const lineTotal = (Number(item.amount) || 0) * (Number(item.quantity) || 0) * discountFactor;
      return sum + lineTotal;
    }, 0);

    const amountInPaise = Math.round(totalAmount * 100);

    const payment = await this.paymentService.createOrder({
      amount: amountInPaise,
      currency: PaymentCurrency.INR,
      receipt: order._id.toString(),
      notes: { orderId: String(order._id), orderNumber: order.orderNumber },
    });

    return payment;
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

  async findAllPaginated(
    filters: OrderFiltersDto
  ): Promise<PaginatedOrderResponseDto> {
    const {
      search = "",
      status,
      mode,
      paymentMode,
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = filters;
    const query: any = {};
    console.log("🪵 ~ OrderService ~ findAllPaginated ~ search:", search);
    if (search) {
      const orConditions: any[] = [
        { name: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];

      if (!isNaN(Number(search))) {
        orConditions.push({ orderNumber: Number(search) });
      }

      query.$or = orConditions;
    }

    if (status) {
      query.status = status;
    }

    if (mode) {
      query.mode = mode;
    }

    if (paymentMode) {
      query.paymentMode = paymentMode;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(query)
        .populate("user", "name role")
        .populate("productDetails.productId", "name image description price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.orderModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
      },
    };
  }

  async getOrderStats(): Promise<OrderStatsDto> {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      revenueResult,
    ] = await Promise.all([
      this.orderModel.countDocuments().exec(),
      this.orderModel.countDocuments({ status: "pending" }).exec(),
      this.orderModel.countDocuments({ status: "delivered" }).exec(),
      this.orderModel
        .countDocuments({
          status: { $in: ["cancelled", "return"] },
        })
        .exec(),
      this.orderModel
        .aggregate([
          { $match: { status: "delivered" } },
          {
            $addFields: {
              orderTotal: {
                $sum: {
                  $map: {
                    input: "$productDetails",
                    as: "item",
                    in: {
                      $multiply: [
                        "$$item.quantity",
                        "$$item.amount",
                        {
                          $subtract: [
                            1,
                            { $divide: ["$$item.discountPercent", 100] },
                          ],
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$orderTotal" },
            },
          },
        ])
        .exec(),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    console.log(
      "🪵 ~ OrderService ~ getOrderStats ~ totalRevenue:",
      totalRevenue
    );

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
    };
  }

  async searchOrders(query: string): Promise<Order[]> {
    const searchRegex = { $regex: query, $options: "i" };

    return this.orderModel
      .find({
        $or: [
          { name: searchRegex },
          { phoneNumber: searchRegex },
          { orderNumber: { $regex: query } },
          { "user.name": searchRegex },
        ],
      })
      .populate("user", "name email role")
      .populate("productDetails.productId", "name image description price")
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();
  }

  async updateOrderStatus(
    id: string,
    updateStatusDto: UpdateOrderStatusDto,
    userId: string
  ): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // Add comment if provided
    const updatedComments = [...order.comments];
    if (updateStatusDto.comment) {
      updatedComments.push({
        user: new Types.ObjectId(userId),
        comment: updateStatusDto.comment,
      });
    }

    // Update additional fields based on status
    const updateData: any = {
      status: updateStatusDto.status,
      comments: updatedComments,
      updatedAt: new Date(),
    };

    // Set delivery date when status is delivered
    if (updateStatusDto.status === "delivered") {
      updateData.deliveryDate = new Date();
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("user", "name email role")
      .populate("productDetails.productId", "name image description price")
      .populate("comments.user", "name email")
      .exec();

    return updatedOrder;
  }

  // Enhanced version of existing findOne method
  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate("user", "name email role phoneNumber")
      .populate(
        "productDetails.productId",
        "name image description price articleNo"
      )
      .populate("comments.user", "name role")
      .populate("shippingPartner", "name contact")
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }
}
