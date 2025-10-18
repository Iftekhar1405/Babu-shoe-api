import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";
import { User } from "src/users/schemas/user.schemas";

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
    @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true, })
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

    // Running outstanding balance used by transactions
    @Prop({ type: Number, default: 0 })
    currentBalance: number

    @Prop({ type: String })
    address: string

    @Prop({ default: true })
    isActive: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
export const CustomerDbName = 'customers'
CustomerSchema.index({ contact: 1 }, { unique: true });
