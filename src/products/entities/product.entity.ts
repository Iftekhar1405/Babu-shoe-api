export class Product {
  id: string;
  name: string;
  image: string;
  price: number;
  categoryId: string;
  articleNo: string;
  createdAt: string;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}