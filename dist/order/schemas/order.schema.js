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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.Order = exports.ORDER_RETURN_REASON = exports.ORDER_CANCELATION_REASON = exports.ORDER_PAYMENT_MODE = exports.ORDER_MODE = exports.ORDER_STATUS = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ORDER_STATUS;
(function (ORDER_STATUS) {
    ORDER_STATUS[ORDER_STATUS["pending"] = 0] = "pending";
    ORDER_STATUS[ORDER_STATUS["confirmed"] = 1] = "confirmed";
    ORDER_STATUS[ORDER_STATUS["packed"] = 2] = "packed";
    ORDER_STATUS[ORDER_STATUS["dispatched"] = 3] = "dispatched";
    ORDER_STATUS[ORDER_STATUS["outfordeliver"] = 4] = "outfordeliver";
    ORDER_STATUS[ORDER_STATUS["delivered"] = 5] = "delivered";
    ORDER_STATUS[ORDER_STATUS["cancelled"] = 6] = "cancelled";
    ORDER_STATUS[ORDER_STATUS["return"] = 7] = "return";
})(ORDER_STATUS || (exports.ORDER_STATUS = ORDER_STATUS = {}));
var ORDER_MODE;
(function (ORDER_MODE) {
    ORDER_MODE[ORDER_MODE["offline"] = 0] = "offline";
    ORDER_MODE[ORDER_MODE["online"] = 1] = "online";
})(ORDER_MODE || (exports.ORDER_MODE = ORDER_MODE = {}));
var ORDER_PAYMENT_MODE;
(function (ORDER_PAYMENT_MODE) {
    ORDER_PAYMENT_MODE[ORDER_PAYMENT_MODE["UPI"] = 0] = "UPI";
    ORDER_PAYMENT_MODE[ORDER_PAYMENT_MODE["Cash"] = 1] = "Cash";
    ORDER_PAYMENT_MODE[ORDER_PAYMENT_MODE["credit"] = 2] = "credit";
})(ORDER_PAYMENT_MODE || (exports.ORDER_PAYMENT_MODE = ORDER_PAYMENT_MODE = {}));
var ORDER_CANCELATION_REASON;
(function (ORDER_CANCELATION_REASON) {
    ORDER_CANCELATION_REASON[ORDER_CANCELATION_REASON["customer_cancel"] = 0] = "customer_cancel";
    ORDER_CANCELATION_REASON[ORDER_CANCELATION_REASON["inventory_issue"] = 1] = "inventory_issue";
    ORDER_CANCELATION_REASON[ORDER_CANCELATION_REASON["others"] = 2] = "others";
})(ORDER_CANCELATION_REASON || (exports.ORDER_CANCELATION_REASON = ORDER_CANCELATION_REASON = {}));
var ORDER_RETURN_REASON;
(function (ORDER_RETURN_REASON) {
    ORDER_RETURN_REASON[ORDER_RETURN_REASON["damaged"] = 0] = "damaged";
    ORDER_RETURN_REASON[ORDER_RETURN_REASON["wrong_product"] = 1] = "wrong_product";
    ORDER_RETURN_REASON[ORDER_RETURN_REASON["others"] = 2] = "others";
})(ORDER_RETURN_REASON || (exports.ORDER_RETURN_REASON = ORDER_RETURN_REASON = {}));
let ProductDetail = class ProductDetail {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Project', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductDetail.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ProductDetail.prototype, "quatity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductDetail.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ProductDetail.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ProductDetail.prototype, "discountPercent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductDetail.prototype, "salesPerson", void 0);
ProductDetail = __decorate([
    (0, mongoose_1.Schema)()
], ProductDetail);
let Comment = class Comment {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Comment.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Comment.prototype, "comment", void 0);
Comment = __decorate([
    (0, mongoose_1.Schema)()
], Comment);
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ProductDetail], required: true, _id: false }),
    __metadata("design:type", Array)
], Order.prototype, "productDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ORDER_MODE, required: true }),
    __metadata("design:type", String)
], Order.prototype, "mode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ORDER_PAYMENT_MODE, required: true }),
    __metadata("design:type", String)
], Order.prototype, "paymentMode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Order.prototype, "orderNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Address', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ORDER_STATUS,
        default: 'pending',
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ORDER_CANCELATION_REASON, required: false }),
    __metadata("design:type", String)
], Order.prototype, "cancelationReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Order.prototype, "cancelationDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ORDER_RETURN_REASON, required: false }),
    __metadata("design:type", String)
], Order.prototype, "returnReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Order.prototype, "returnDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], Order.prototype, "deliveryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'ShippingPartner', required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "shippingPartner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Order.prototype, "trackingId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], Order.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Comment], default: [], _id: false }),
    __metadata("design:type", Array)
], Order.prototype, "comments", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
//# sourceMappingURL=order.schema.js.map