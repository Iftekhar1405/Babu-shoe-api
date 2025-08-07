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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
let OrderService = class OrderService {
    constructor(orderModel) {
        this.orderModel = orderModel;
    }
    async create(createOrderDto) {
        const lastOrder = await this.orderModel
            .findOne({})
            .sort({ orderNumber: -1 })
            .select('orderNumber')
            .lean();
        const nextOrderNumber = lastOrder?.orderNumber ? lastOrder.orderNumber + 1 : 1;
        const newOrder = new this.orderModel({
            ...createOrderDto,
            orderNumber: nextOrderNumber,
        });
        return await newOrder.save();
    }
    async findAll() {
        return await this.orderModel.find()
            .populate('user')
            .populate('productDetails.projectId')
            .populate('address')
            .populate('shippingPartner')
            .populate('comments.user')
            .exec();
    }
    async findOne(id) {
        const order = await this.orderModel.findById(id)
            .populate('user')
            .populate('productDetails.projectId')
            .populate('address')
            .populate('shippingPartner')
            .populate('comments.user')
            .exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order with id ${id} not found`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
        if (!updatedOrder) {
            throw new common_1.NotFoundException(`Order with id ${id} not found`);
        }
        return updatedOrder;
    }
    async remove(id) {
        const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
        if (!deletedOrder) {
            throw new common_1.NotFoundException(`Order with id ${id} not found`);
        }
        return deletedOrder;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrderService);
//# sourceMappingURL=order.service.js.map