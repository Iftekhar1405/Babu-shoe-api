import { Product, ProductDocument } from "src/products/schemas/product.schema";
import { BillDocument } from "../schemas/billing.schemas";
import { ReplaceField } from "src/common/enums/types";

// item when NOT populated (what schema defines)
export type BillItemUnpopulated = BillDocument["items"][number];
// item when populated
export type BillItemPopulated = ReplaceField<BillItemUnpopulated, "productId", ProductDocument>;

// full bill types
export type BillWithObjectId = Omit<BillDocument, "items"> & { items: BillItemUnpopulated[] };
export type BillWithProducts = Omit<BillDocument, "items"> & { items: BillItemPopulated[] };
