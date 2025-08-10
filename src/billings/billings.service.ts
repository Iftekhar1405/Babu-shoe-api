import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model, Types } from "mongoose";
import { Bill, BillDocument } from "./schemas/billing.schemas";
import { CreateBillDto } from "./dto/create-bill.dto";
import { Product } from "src/products/schemas/product.schema";

@Injectable()
export class BillService {
  constructor(
    @InjectModel(Bill.name) private billModel: Model<BillDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>
  ) {}

  async createBill(createBillDto: CreateBillDto): Promise<Bill> {
    const productIds = createBillDto.items.map(
      (product) => new Types.ObjectId(product?.productId)
    );
    console.log("🪵 ~ BillService ~ createBill ~ productIds:", productIds)

    const exisitingProducts = await this.productModel.find({
      _id: { $in: productIds },
    });
    console.log("🪵 ~ BillService ~ createBill ~ exisitingProducts:", exisitingProducts)

    const existingIds = exisitingProducts.map((doc) => doc._id.toString());
    console.log("🪵 ~ BillService ~ createBill ~ existingIds:", existingIds)

    const invalidProduct = createBillDto.items.filter(
      (product) => !existingIds.includes(product?.productId)
    );
    console.log("🪵 ~ BillService ~ createBill ~ invalidProduct:", invalidProduct)

    if (invalidProduct.length) {
      throw new NotFoundException({
        error: true,
        message: "Product not found",
        data: invalidProduct,
      });
    }

    const bill = new this.billModel(createBillDto);
    return bill.save();
  }

  async getAllBills(): Promise<Bill[]> {
    return this.billModel
      .find()
      .populate("items.productId")
      .sort({ createdAt: -1 })
      .exec();
  }

  async getBillById(id: string): Promise<Bill> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid bill ID");
    }

    const bill = await this.billModel
      .findById(id)
      .populate("items.productId")
      .exec();

    if (!bill) {
      throw new NotFoundException(`Bill with ID "${id}" not found`);
    }
    return bill;
  }

  async updateBill(
    id: string,
    updateData: Partial<CreateBillDto>
  ): Promise<Bill> {
    const updatedBill = await this.billModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("items.productId")
      .exec();

    if (!updatedBill) {
      throw new NotFoundException(`Bill with ID "${id}" not found`);
    }
    return updatedBill;
  }

  async deleteBill(id: string): Promise<{ message: string }> {
    const result = await this.billModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Bill with ID "${id}" not found`);
    }
    return { message: "Bill deleted successfully" };
  }
}
