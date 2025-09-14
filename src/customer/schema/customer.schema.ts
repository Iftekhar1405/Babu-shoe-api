import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Role } from "../../common/enums/role.enum";
import { User } from "src/users/schemas/user.schemas";

export type CustomerDocument = Customer & Document;


export class Customer {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true, })
    userId: string;

    @Prop({
        required: true,
        unique: true,
        match: /^[+]?[1-9][\d]{0,15}$/,
    })
    contact: string;

    @Prop({ type: Number, default: 2000 })
    creditLimit: number

    @Prop({ type: Number, default: 0 })
    creditBalance: number

    @Prop({ type: String })
    address: string

    @Prop({ default: true })
    isActive: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ phoneNumber: 1 }, { unique: true });
