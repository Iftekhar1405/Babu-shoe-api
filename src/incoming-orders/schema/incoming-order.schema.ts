import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';
import { User } from 'src/users/schemas/user.schemas';

@Schema({ timestamps: true })
export class IncomingOrder extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
    vendorId: Types.ObjectId;

    @Prop([{
        productId: { type: Types.ObjectId, ref: Product.name, required: true },
        color: { type: String },
        sizes: [{ type: String }],
        quantity: { type: Number, required: true },
        matchedQuantity: { type: Number, default: 0 }
    }])
    productDetails: {
        productId: Types.ObjectId;
        color: string;
        sizes: string[];
        quantity: number;
        matchedQuantity: number;
    }[];

    @Prop({ type: Types.ObjectId, ref: User.name })
    matchedBy: Types.ObjectId;

    @Prop({ type: Date })
    matchedAt: Date;

    @Prop({ type: String })
    billImgUrl: string;

    @Prop({ type: Number, min: 0, max: 100 })
    matchPercentage: number;

    @Prop([{
        user: { type: Types.ObjectId, ref: User.name },
        comment: { type: String }
    }])
    comments: {
        user: Types.ObjectId;
        comment: string;
    }[];
}

export const IncomingOrderSchema = SchemaFactory.createForClass(IncomingOrder);
