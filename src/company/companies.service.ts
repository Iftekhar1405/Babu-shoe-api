import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company, CompanyDocument, } from './schemas/company.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) { }

  async create(createCompanyDto: Partial<CompanyDocument>): Promise<Company> {
    const createdCompany = new this.companyModel(createCompanyDto);
    return createdCompany.save();
  }

  async findAll(): Promise<Company[]> {
    return await this.companyModel.find();
  }

  async findOne(id: string): Promise<Company> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid company ID`);
    }
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundException(`Company #${id} not found`);
    }
    return company;
  }

  async update(id: string, updateCompanyDto: Partial<CompanyDocument>): Promise<Company> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid company ID`);
    }
    const updatedCompany = await this.companyModel
      .findByIdAndUpdate(id, updateCompanyDto, { new: true })
      .exec();
    if (!updatedCompany) {
      throw new NotFoundException(`Company #${id} not found`);
    }
    return updatedCompany;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid company ID`);
    }
    const result = await this.companyModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Company #${id} not found`);
    }
    return { deleted: true };
  }
}
