import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Bill, BillDocument, ProductDetail } from "./schemas/billing.schemas";
import { Product, ProductDocument } from "src/products/schemas/product.schema";
import { RemoveBillItemDto } from "./dto/remove-bill.dto";
import { UpdateBillItemDto } from "./dto/update-bill-dto";
import { BillItemPopulated, BillItemUnpopulated, BillWithObjectId, BillWithProducts } from "./types";

@Injectable()
export class BillService {
  constructor(
    @InjectModel(Bill.name) private billModel: Model<BillDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) { }

  async addToCart(userId: string, createBillDto: ProductDetail) {
    // Verify product exists
    const product = await this.productModel.findById(createBillDto.productId).lean();
    if (!product) throw new NotFoundException("Product not found");

    // cart before populate → productId is ObjectId
    let cart = await this.billModel.findOne({
      biller: new Types.ObjectId(userId),
      billPrinted: false,
    }) as BillWithObjectId | null;

    const newItem: BillItemUnpopulated = {
      productId: new Types.ObjectId(createBillDto.productId),
      quantity: createBillDto.quantity,
      color: createBillDto.color,
      size: createBillDto.size,
      discountPercent: createBillDto.discountPercent,
      salesPerson: createBillDto.salesPerson,
    };

    if (cart) {
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === createBillDto.productId.toString() &&
          item.color === createBillDto.color,
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += createBillDto.quantity;
      } else {
        cart.items.push(newItem); // ✅ works, productId is ObjectId here
      }
    } else {
      cart = new this.billModel({
        biller: new Types.ObjectId(userId),
        items: [newItem],
        billPrinted: false,
        totalAmount: 0,
      }) as BillWithObjectId;
    }

    const savedCart = await cart.save();

    // repopulate → productId becomes ProductDocument
    const populatedCart = await this.billModel
      .findById(savedCart._id)
      .populate({
        path: "items.productId",
        populate: [{ path: "categoryId" }, { path: "companyId" }, { path: "tags" }],
      })
      .exec() as unknown as BillWithProducts;

    // ✅ now you can safely access product.price
    populatedCart.totalAmount = populatedCart.items.reduce(
      (total, item) => total + ((item.productId.price) * (1 - item.discountPercent / 100) * item.quantity),
      0,
    );

    await populatedCart.save();
    return populatedCart;
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

  async updateBillItem(userId: string, updateBillItemDto: UpdateBillItemDto) {
    const cart = await this.billModel.findOne({
      biller: new Types.ObjectId(userId),
      billPrinted: false,
    }).populate('items.productId') as unknown as BillWithProducts;

    if (!cart) {
      throw new NotFoundException("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId._id.toString() === updateBillItemDto.productId &&
        item.color === updateBillItemDto.color
    );

    if (itemIndex === -1) {
      throw new NotFoundException("Item not found in cart");
    }

    // Update the item
    if (updateBillItemDto.quantity !== undefined) {
      cart.items[itemIndex].quantity = updateBillItemDto.quantity;
    }

    if (updateBillItemDto.discountPercent !== undefined) {
      cart.items[itemIndex].discountPercent = updateBillItemDto.discountPercent;
    }

    // Recalculate final price
    const item = cart.items[itemIndex];
    const product = await this.productModel.findById(item.productId);
    const basePrice = product.price * item.quantity;

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + ((item.productId.price) * (1 - item.discountPercent / 100) * item.quantity),
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

  async removeBillItem(userId: string, removeBillItemDto: RemoveBillItemDto) {
    const cart = await this.billModel.findOne({
      biller: new Types.ObjectId(userId),
      billPrinted: false,
    }).populate('items.productId') as unknown as BillWithProducts;

    if (!cart) {
      throw new NotFoundException("Cart not found");
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId._id.toString() === removeBillItemDto.productId &&
          item.color === removeBillItemDto.color
        )
    );

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + ((item.productId.price) * (1 - item.discountPercent / 100) * item.quantity),
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
}
