import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';
import { User } from 'src/users/schemas/user.schemas';

@Schema({ timestamps: true })
export class Vendor extends Document {
    @Prop({ type: String, })
    name: string;

    @Prop({ type: [String], })
    contact: string[];

    @Prop({ type: String, })
    logo: string;

    @Prop([{
        name: String,
        contacts: [String]
    }])
    contactPersons: {
        name: string,
        contacts: string[]
    }[];

    @Prop({ type: String, })
    address: string;

    @Prop({ type: String, })
    city: string;

    @Prop({ type: String, })
    district: string;

    @Prop({ type: String, })
    state: string;

    @Prop({ type: String, })
    pincode: string;

}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
