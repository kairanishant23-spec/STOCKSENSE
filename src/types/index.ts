export interface User {
  id: string;
  loginId: string;
  email: string;
  name: string;
  role: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitOfMeasure: string;
  perUnitCost: number;
  onHand: number;
  freeToUse: number;
  initialStock: number;
}

export interface Warehouse {
  id: string;
  name: string;
  shortCode: string;
  address: string;
}

export interface Location {
  id: string;
  name: string;
  shortCode: string;
  warehouseId: string;
}

export type ReceiptStatus = 'Draft' | 'Ready' | 'Done' | 'Cancelled';
export type DeliveryStatus = 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Cancelled';
export type MoveType = 'IN' | 'OUT' | 'INTERNAL' | 'ADJUSTMENT';

export interface OperationItem {
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
}

export interface Receipt {
  id: string;
  reference: string;
  from: string;
  to: string;
  contact: string;
  scheduleDate: string;
  status: ReceiptStatus;
  responsible: string;
  items: OperationItem[];
  createdAt: string;
}

export interface Delivery {
  id: string;
  reference: string;
  from: string;
  to: string;
  contact: string;
  deliveryAddress: string;
  scheduleDate: string;
  status: DeliveryStatus;
  responsible: string;
  operationType: string;
  items: OperationItem[];
  createdAt: string;
}

export interface StockMove {
  id: string;
  reference: string;
  date: string;
  contact: string;
  from: string;
  to: string;
  quantity: number;
  status: string;
  moveType: MoveType;
  productName: string;
  productId?: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  location: string;
  recordedQty: number;
  countedQty: number;
  difference: number;
  date: string;
  adjustedBy: string;
}

export interface InternalTransfer {
  id: string;
  reference: string;
  from: string;
  to: string;
  product: string;
  quantity: number;
  date: string;
  status: string;
}

export interface ReorderRule {
  id: string;
  productId: string;
  productName: string;
  minQty: number;
  maxQty: number;
  reorderQty: number;
}
