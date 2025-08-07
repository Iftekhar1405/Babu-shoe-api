import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schemas';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ 
      phoneNumber: createUserDto.phoneNumber 
    });
    
    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ phoneNumber });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createAdminUser(): Promise<User> {
    const adminExists = await this.userModel.findOne({ role: Role.ADMIN });
    if (adminExists) {
      return adminExists;
    }

    const adminDto: CreateUserDto = {
      name: 'System Admin',
      phoneNumber: '9109390639',
      password: 'admin1234',
      role: Role.ADMIN,
    };

    return this.create(adminDto);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}