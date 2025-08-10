import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bill, BillDocument } from './schemas/billing.schemas';
import { CreateBillDto } from './dto/create-bill.dto';


@Injectable()
export class BillService {
  constructor(
    @InjectModel(Bill.name) private billModel: Model<BillDocument>,
  ) {}

  async createBill(createBillDto: CreateBillDto): Promise<Bill> {

    const bill = new this.billModel(createBillDto);
    return bill.save();
  }

  async getAllBills(): Promise<Bill[]> {
    return this.billModel
      .find()
      .populate('items.productId') 
      .sort({ createdAt: -1 })
      .exec();
  }
  
  async getBillById(id: string): Promise<Bill> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid bill ID');
    }

    const bill = await this.billModel
      .findById(id)
      .populate('items.productId')
      .exec();

    if (!bill) {
      throw new NotFoundException(`Bill with ID "${id}" not found`);
    }
    return bill;
  }

  async updateBill(id: string, updateData: Partial<CreateBillDto>): Promise<Bill> {
    const updatedBill = await this.billModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('items.productId')
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
    return { message: 'Bill deleted successfully' };
  }
}
