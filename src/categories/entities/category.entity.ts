export class Category {
  id: string;
  name: string;
  image: string;
  createdAt: string;

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}