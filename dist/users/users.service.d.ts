import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schemas';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findByPhoneNumber(phoneNumber: string): Promise<UserDocument>;
    findById(id: string): Promise<UserDocument>;
    createAdminUser(): Promise<User>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
