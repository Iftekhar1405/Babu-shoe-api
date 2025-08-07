"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const role_enum_1 = require("../common/enums/role.enum");
const user_schemas_1 = require("./schemas/user.schemas");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const existingUser = await this.userModel.findOne({
            phoneNumber: createUserDto.phoneNumber
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this phone number already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        return createdUser.save();
    }
    async findByPhoneNumber(phoneNumber) {
        const user = await this.userModel.findOne({ phoneNumber });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findById(id) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async createAdminUser() {
        const adminExists = await this.userModel.findOne({ role: role_enum_1.Role.ADMIN });
        if (adminExists) {
            return adminExists;
        }
        const adminDto = {
            name: 'System Admin',
            phoneNumber: '9109390639',
            password: 'admin1234',
            role: role_enum_1.Role.ADMIN,
        };
        return this.create(adminDto);
    }
    async validatePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schemas_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map