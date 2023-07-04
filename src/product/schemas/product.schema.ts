import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {

  constructor(product?: Partial<Product>) {
      this.name = product?.name,
      this.category = product?.category,
      this.description = product?.description,
      this.price = product?.price
  }

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);