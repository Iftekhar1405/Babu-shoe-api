import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Bill, BillDocument, ProductDetail } from "./schemas/billing.schemas";
import { Product, ProductDocument } from "src/products/schemas/product.schema";
import { CreateBillDto } from "./dto/add-to-bill.dto";

@Injectable()
export class BillService {
  constructor(
    @InjectModel(Bill.name) private billModel: Model<BillDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async addToCart(userId: string, createBillDto: CreateBillDto) {
    // Verify product exists
    const product = await this.productModel.findById(createBillDto.productId);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    // Find existing cart for user
    let cart = await this.billModel.findOne({
      biller: new Types.ObjectId(userId),
      billPrinted: false,
    });

    const newItem: ProductDetail = {
      productId: new Types.ObjectId(createBillDto.productId),
      quantity: createBillDto.quantity,
      color: createBillDto.color,
      amount: createBillDto.amount,
      discountPercent: createBillDto.discountPercent,
      finalPrice: createBillDto.finalPrice,
      salesPerson: createBillDto.salesPerson,
    };

    if (cart) {
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === createBillDto.productId &&
          item.color === createBillDto.color
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += createBillDto.quantity;
        cart.items[existingItemIndex].finalPrice += createBillDto.finalPrice;
      } else {
        // Add new item
        cart.items.push(newItem);
      }
    } else {
      // Create new cart
      cart = new this.billModel({
        biller: new Types.ObjectId(userId),
        items: [newItem],
        billPrinted: false,
        totalAmount: 0, 
      });
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.finalPrice,
      0
    );

 
    const savedCart = await cart.save();
    return await this.billModel
      .findById(savedCart._id)
      .populate({
        path: "items.productId",
        populate: [
          { path: "categoryId" },
          { path: "companyId" },
          { path: "tags" },
        ],
      })
      .exec();
  }

  async getBill(userId: string) {
    let cart = await this.billModel
      .findOne({
        biller: new Types.ObjectId(userId),
        // billPrinted: false
      })
      .populate({
        path: "items.productId",
        populate: [
          { path: "categoryId" },
          { path: "companyId" },
          { path: "tags" },
        ],
      })
      .exec();

    if (!cart) {
      // Create new empty cart if none exists
      cart = new this.billModel({
        biller: new Types.ObjectId(userId),
        items: [],
        billPrinted: false,
        totalAmount: 0,
      });
      await cart.save();
    }

    return cart;
  }

  async clear(userId: string) {
    let cart = await this.billModel.findOne({
      biller: new Types.ObjectId(userId),
      //   billPrinted : false
    });

    if (!cart) {
      throw new NotFoundException("Cart not found");
    }

    cart.items = [];
    cart.totalAmount = 0;
    cart.billPrinted = false;

    await cart.save();

    return cart;
  }
}
