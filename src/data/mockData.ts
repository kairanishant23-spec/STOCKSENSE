import { 
  Product, Warehouse, Location, Receipt, Delivery, StockMove, StockAdjustment, InternalTransfer
} from '../types';

export const mockProducts: Product[] = [
  { id: '1', name: 'Office Desk', sku: 'DESK001', category: 'Furniture', unitOfMeasure: 'Units', perUnitCost: 4500, onHand: 50, freeToUse: 45, initialStock: 50 },
  { id: '2', name: 'Conference Table', sku: 'TABL001', category: 'Furniture', unitOfMeasure: 'Units', perUnitCost: 12000, onHand: 10, freeToUse: 10, initialStock: 10 },
  { id: '3', name: 'Ergonomic Chair', sku: 'CHAI001', category: 'Furniture', unitOfMeasure: 'Units', perUnitCost: 3500, onHand: 120, freeToUse: 100, initialStock: 120 },
  { id: '4', name: 'Steel Rods (10mm)', sku: 'STEL001', category: 'Raw Materials', unitOfMeasure: 'Kg', perUnitCost: 65, onHand: 5000, freeToUse: 5000, initialStock: 5000 },
  { id: '5', name: '24-inch Monitor', sku: 'MONI001', category: 'Electronics', unitOfMeasure: 'Units', perUnitCost: 15000, onHand: 30, freeToUse: 25, initialStock: 30 },
  { id: '6', name: 'Mechanical Keyboard', sku: 'KEYB001', category: 'Electronics', unitOfMeasure: 'Units', perUnitCost: 2500, onHand: 80, freeToUse: 80, initialStock: 80 },
];

export const mockWarehouses: Warehouse[] = [
  { id: '1', name: 'Main Warehouse', shortCode: 'WH', address: '123 Industrial Area, City' },
  { id: '2', name: 'Secondary Warehouse', shortCode: 'WH2', address: '456 Business Park, City' },
];

export const mockLocations: Location[] = [
  { id: '1', name: 'Stock Room 1', shortCode: 'SR1', warehouseId: '1' },
  { id: '2', name: 'Stock Room 2', shortCode: 'SR2', warehouseId: '1' },
  { id: '3', name: 'Production Floor', shortCode: 'PF1', warehouseId: '1' },
  { id: '4', name: 'Shipping Area', shortCode: 'SA1', warehouseId: '2' },
];

export const mockReceipts: Receipt[] = [
  { id: '1', reference: 'WH/IN/0001', from: 'Vendor A', to: 'WH/Stock', contact: 'John Doe', scheduleDate: '2026-09-20', status: 'Done', responsible: 'Admin', items: [{ productId: '1', productName: 'Office Desk', productSku: 'DESK001', quantity: 50 }], createdAt: '2026-09-18' },
  { id: '2', reference: 'WH/IN/0002', from: 'Vendor B', to: 'WH/Stock', contact: 'Jane Smith', scheduleDate: '2026-09-25', status: 'Ready', responsible: 'Admin', items: [{ productId: '3', productName: 'Ergonomic Chair', productSku: 'CHAI001', quantity: 100 }], createdAt: '2026-09-22' },
  { id: '3', reference: 'WH/IN/0003', from: 'Vendor C', to: 'WH2/Stock', contact: 'Bob Johnson', scheduleDate: '2026-09-28', status: 'Draft', responsible: 'Admin', items: [{ productId: '4', productName: 'Steel Rods (10mm)', productSku: 'STEL001', quantity: 1000 }], createdAt: '2026-09-25' },
  { id: '4', reference: 'WH/IN/0004', from: 'Vendor A', to: 'WH/Stock', contact: 'John Doe', scheduleDate: '2026-10-01', status: 'Draft', responsible: 'User', items: [{ productId: '5', productName: '24-inch Monitor', productSku: 'MONI001', quantity: 20 }], createdAt: '2026-09-26' },
];

export const mockDeliveries: Delivery[] = [
  { id: '1', reference: 'WH/OUT/0001', from: 'WH/Stock', to: 'Customer X', contact: 'Alice Brown', deliveryAddress: '789 Retail St', scheduleDate: '2026-09-21', status: 'Done', responsible: 'Admin', operationType: 'Delivery', items: [{ productId: '1', productName: 'Office Desk', productSku: 'DESK001', quantity: 5 }], createdAt: '2026-09-20' },
  { id: '2', reference: 'WH/OUT/0002', from: 'WH/Stock', to: 'Customer Y', contact: 'Charlie Green', deliveryAddress: '101 Office Blvd', scheduleDate: '2026-09-26', status: 'Ready', responsible: 'Admin', operationType: 'Delivery', items: [{ productId: '3', productName: 'Ergonomic Chair', productSku: 'CHAI001', quantity: 20 }], createdAt: '2026-09-24' },
  { id: '3', reference: 'WH/OUT/0003', from: 'WH/Stock', to: 'Customer Z', contact: 'Diana White', deliveryAddress: '202 Tech Park', scheduleDate: '2026-09-27', status: 'Waiting', responsible: 'Admin', operationType: 'Delivery', items: [{ productId: '2', productName: 'Conference Table', productSku: 'TABL001', quantity: 15 }], createdAt: '2026-09-25' },
  { id: '4', reference: 'WH/OUT/0004', from: 'WH2/Stock', to: 'Customer W', contact: 'Eve Black', deliveryAddress: '303 Market Sq', scheduleDate: '2026-10-02', status: 'Draft', responsible: 'User', operationType: 'Delivery', items: [{ productId: '6', productName: 'Mechanical Keyboard', productSku: 'KEYB001', quantity: 10 }], createdAt: '2026-09-26' },
];

export const mockStockMoves: StockMove[] = [
  { id: '1', reference: 'WH/IN/0001', date: '2026-09-20', contact: 'Vendor A', from: 'Partner Locations/Vendors', to: 'WH/Stock', quantity: 50, status: 'Done', moveType: 'IN', productName: 'Office Desk' },
  { id: '2', reference: 'WH/OUT/0001', date: '2026-09-21', contact: 'Customer X', from: 'WH/Stock', to: 'Partner Locations/Customers', quantity: 5, status: 'Done', moveType: 'OUT', productName: 'Office Desk' },
  { id: '3', reference: 'WH/IN/0002', date: '2026-09-25', contact: 'Vendor B', from: 'Partner Locations/Vendors', to: 'WH/Stock', quantity: 100, status: 'Ready', moveType: 'IN', productName: 'Ergonomic Chair' },
  { id: '4', reference: 'WH/OUT/0002', date: '2026-09-26', contact: 'Customer Y', from: 'WH/Stock', to: 'Partner Locations/Customers', quantity: 20, status: 'Ready', moveType: 'OUT', productName: 'Ergonomic Chair' },
  { id: '5', reference: 'WH/IN/0003', date: '2026-09-28', contact: 'Vendor C', from: 'Partner Locations/Vendors', to: 'WH2/Stock', quantity: 1000, status: 'Draft', moveType: 'IN', productName: 'Steel Rods (10mm)' },
  { id: '6', reference: 'WH/OUT/0003', date: '2026-09-27', contact: 'Customer Z', from: 'WH/Stock', to: 'Partner Locations/Customers', quantity: 15, status: 'Waiting', moveType: 'OUT', productName: 'Conference Table' },
  { id: '7', reference: 'INT/001', date: '2026-09-15', contact: 'Internal', from: 'WH/Stock', to: 'WH2/Stock', quantity: 10, status: 'Done', moveType: 'INTERNAL', productName: '24-inch Monitor' },
  { id: '8', reference: 'ADJ/001', date: '2026-09-10', contact: 'Inventory', from: 'Virtual/Adjustment', to: 'WH/Stock', quantity: 2, status: 'Done', moveType: 'ADJUSTMENT', productName: 'Mechanical Keyboard' },
];

export const mockAdjustments: StockAdjustment[] = [
  { id: '1', productId: '6', productName: 'Mechanical Keyboard', location: 'WH/Stock', recordedQty: 78, countedQty: 80, difference: 2, date: '2026-09-10', adjustedBy: 'Admin' },
  { id: '2', productId: '1', productName: 'Office Desk', location: 'WH/Stock', recordedQty: 51, countedQty: 50, difference: -1, date: '2026-09-12', adjustedBy: 'Admin' },
];

export const mockTransfers: InternalTransfer[] = [
  { id: '1', reference: 'INT/001', from: 'WH/Stock', to: 'WH2/Stock', product: '24-inch Monitor', quantity: 10, date: '2026-09-15', status: 'Done' },
  { id: '2', reference: 'INT/002', from: 'WH2/Stock', to: 'WH/Stock', product: 'Mechanical Keyboard', quantity: 5, date: '2026-09-28', status: 'Ready' },
];
