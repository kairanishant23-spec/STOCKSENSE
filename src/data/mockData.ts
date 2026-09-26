import { 
  Product, Warehouse, Location, Receipt, Delivery, StockMove, StockAdjustment, InternalTransfer
} from '../types';

export const mockProducts: Product[] = [
  { id: '1', name: 'Dehradun Sheesham Wood Desk', sku: 'DESK001', category: 'Furniture', unitOfMeasure: 'Units', perUnitCost: 4500, onHand: 50, freeToUse: 45, initialStock: 50 },
  { id: '2', name: 'Himalayan Pine Conference Table', sku: 'TABL001', category: 'Furniture', unitOfMeasure: 'Units', perUnitCost: 12500, onHand: 10, freeToUse: 10, initialStock: 10 },
  { id: '3', name: 'Ergonomic Office Chair', sku: 'CHAI001', category: 'Furniture', unitOfMeasure: 'Units', perUnitCost: 3200, onHand: 120, freeToUse: 100, initialStock: 120 },
  { id: '4', name: 'Tata Tiscon Steel Rods (12mm)', sku: 'STEL001', category: 'Raw Materials', unitOfMeasure: 'Kg', perUnitCost: 72, onHand: 5000, freeToUse: 5000, initialStock: 5000 },
  { id: '5', name: 'Kangra Organic Green Tea Packets', sku: 'TEA001', category: 'Packaged Goods', unitOfMeasure: 'Units', perUnitCost: 450, onHand: 400, freeToUse: 380, initialStock: 400 },
  { id: '6', name: 'Almora Handcrafted Copper Vessel', sku: 'COPR001', category: 'Utensils', unitOfMeasure: 'Units', perUnitCost: 1850, onHand: 80, freeToUse: 80, initialStock: 80 },
];

export const mockWarehouses: Warehouse[] = [
  { id: '1', name: 'Dehradun Central Warehouse', shortCode: 'DED', address: 'Plot 14, Transport Nagar, Saharanpur Road, Dehradun, Uttarakhand - 248001' },
  { id: '2', name: 'Palampur Regional Depot', shortCode: 'PLP', address: 'Near Tea Gardens, Holta, Palampur, Himachal Pradesh - 176061' },
  { id: '3', name: 'Dharamshala Operations Hub', shortCode: 'DHM', address: 'Civil Lines, Lower Dharamshala, Himachal Pradesh - 176215' },
  { id: '4', name: 'Almora Valley Center', shortCode: 'ALM', address: 'Mall Road, Near Shikhar Hotel, Almora, Uttarakhand - 263601' },
];

export const mockLocations: Location[] = [
  { id: '1', name: 'Dehradun Main Storage', shortCode: 'DED/Stock1', warehouseId: '1' },
  { id: '2', name: 'Palampur Dispatch Floor', shortCode: 'PLP/Floor', warehouseId: '2' },
  { id: '3', name: 'Dharamshala Assembly Rack', shortCode: 'DHM/RackA', warehouseId: '3' },
  { id: '4', name: 'Almora Mountain Bay', shortCode: 'ALM/Bay1', warehouseId: '4' },
];

export const mockReceipts: Receipt[] = [
  { 
    id: '1', 
    reference: 'WH/IN/0001', 
    from: 'Mohan Steels (Dharamshala)', 
    to: 'DED/Stock1', 
    contact: 'Mohan Lal', 
    scheduleDate: '2026-09-20', 
    status: 'Done', 
    responsible: 'Ram Kumar', 
    items: [{ productId: '4', productName: 'Tata Tiscon Steel Rods (12mm)', productSku: 'STEL001', quantity: 1000 }], 
    createdAt: '2026-09-18' 
  },
  { 
    id: '2', 
    reference: 'WH/IN/0002', 
    from: 'Karan Furnishings (Palampur)', 
    to: 'DED/Stock1', 
    contact: 'Karan Sharma', 
    scheduleDate: '2026-09-25', 
    status: 'Ready', 
    responsible: 'Ram Kumar', 
    items: [{ productId: '1', productName: 'Dehradun Sheesham Wood Desk', productSku: 'DESK001', quantity: 50 }], 
    createdAt: '2026-09-22' 
  },
  { 
    id: '3', 
    reference: 'WH/IN/0003', 
    from: 'Meeni Mountain Emporium (Almora)', 
    to: 'PLP/Floor', 
    contact: 'Meeni Verma', 
    scheduleDate: '2026-09-28', 
    status: 'Draft', 
    responsible: 'Mohan Lal', 
    items: [{ productId: '6', productName: 'Almora Handcrafted Copper Vessel', productSku: 'COPR001', quantity: 40 }], 
    createdAt: '2026-09-25' 
  },
  { 
    id: '4', 
    reference: 'WH/IN/0004', 
    from: 'Kangra Valley Tea Depot (Palampur)', 
    to: 'DHM/RackA', 
    contact: 'Karan Sharma', 
    scheduleDate: '2026-10-01', 
    status: 'Draft', 
    responsible: 'Meeni Verma', 
    items: [{ productId: '5', productName: 'Kangra Organic Green Tea Packets', productSku: 'TEA001', quantity: 200 }], 
    createdAt: '2026-09-26' 
  },
];

export const mockDeliveries: Delivery[] = [
  { 
    id: '1', 
    reference: 'WH/OUT/0001', 
    from: 'DED/Stock1', 
    to: 'Ram Niwas Complex', 
    contact: 'Ram Kumar', 
    deliveryAddress: 'Rajpur Road, Near Clock Tower, Dehradun, Uttarakhand', 
    scheduleDate: '2026-09-21', 
    status: 'Done', 
    responsible: 'Ram Kumar', 
    operationType: 'Standard Delivery', 
    items: [{ productId: '1', productName: 'Dehradun Sheesham Wood Desk', productSku: 'DESK001', quantity: 5 }], 
    createdAt: '2026-09-20' 
  },
  { 
    id: '2', 
    reference: 'WH/OUT/0002', 
    from: 'PLP/Floor', 
    to: 'Mohan Hardware Mart', 
    contact: 'Mohan Lal', 
    deliveryAddress: 'Main Bazaar, Near Subhash Chowk, Palampur, HP', 
    scheduleDate: '2026-09-26', 
    status: 'Ready', 
    responsible: 'Karan Sharma', 
    operationType: 'Standard Delivery', 
    items: [{ productId: '3', productName: 'Ergonomic Office Chair', productSku: 'CHAI001', quantity: 20 }], 
    createdAt: '2026-09-24' 
  },
  { 
    id: '3', 
    reference: 'WH/OUT/0003', 
    from: 'DHM/RackA', 
    to: 'Meeni Retreat Center', 
    contact: 'Meeni Verma', 
    deliveryAddress: 'Bhagsunag Road, McLeod Ganj, Dharamshala, HP', 
    scheduleDate: '2026-09-27', 
    status: 'Waiting', 
    responsible: 'Mohan Lal', 
    operationType: 'Express Delivery', 
    items: [{ productId: '2', productName: 'Himalayan Pine Conference Table', productSku: 'TABL001', quantity: 15 }], 
    createdAt: '2026-09-25' 
  },
  { 
    id: '4', 
    reference: 'WH/OUT/0004', 
    from: 'ALM/Bay1', 
    to: 'Karan Educational Institute', 
    contact: 'Karan Sharma', 
    deliveryAddress: 'Bright End Corner, Mall Road, Almora, Uttarakhand', 
    scheduleDate: '2026-10-02', 
    status: 'Draft', 
    responsible: 'Meeni Verma', 
    operationType: 'Standard Delivery', 
    items: [{ productId: '5', productName: 'Kangra Organic Green Tea Packets', productSku: 'TEA001', quantity: 10 }], 
    createdAt: '2026-09-26' 
  },
];

export const mockStockMoves: StockMove[] = [
  { id: '1', reference: 'WH/IN/0001', date: '2026-09-20', contact: 'Mohan Steels (Dharamshala)', from: 'Dharamshala Works', to: 'DED/Stock1', quantity: 1000, status: 'Done', moveType: 'IN', productName: 'Tata Tiscon Steel Rods (12mm)' },
  { id: '2', reference: 'WH/OUT/0001', date: '2026-09-21', contact: 'Ram Niwas Complex (Dehradun)', from: 'DED/Stock1', to: 'Dehradun Client Site', quantity: 5, status: 'Done', moveType: 'OUT', productName: 'Dehradun Sheesham Wood Desk' },
  { id: '3', reference: 'WH/IN/0002', date: '2026-09-25', contact: 'Karan Furnishings (Palampur)', from: 'Palampur Workshop', to: 'DED/Stock1', quantity: 50, status: 'Ready', moveType: 'IN', productName: 'Dehradun Sheesham Wood Desk' },
  { id: '4', reference: 'WH/OUT/0002', date: '2026-09-26', contact: 'Mohan Hardware Mart (Palampur)', from: 'PLP/Floor', to: 'Palampur Storefront', quantity: 20, status: 'Ready', moveType: 'OUT', productName: 'Ergonomic Office Chair' },
  { id: '5', reference: 'WH/IN/0003', date: '2026-09-28', contact: 'Meeni Mountain Emporium (Almora)', from: 'Almora Artisan Unit', to: 'PLP/Floor', quantity: 40, status: 'Draft', moveType: 'IN', productName: 'Almora Handcrafted Copper Vessel' },
  { id: '6', reference: 'WH/OUT/0003', date: '2026-09-27', contact: 'Meeni Retreat Center (Dharamshala)', from: 'DHM/RackA', to: 'Dharamshala Resort', quantity: 15, status: 'Waiting', moveType: 'OUT', productName: 'Himalayan Pine Conference Table' },
  { id: '7', reference: 'INT/001', date: '2026-09-15', contact: 'Ram Kumar (Transfers)', from: 'DED/Stock1', to: 'PLP/Floor', quantity: 200, status: 'Done', moveType: 'INTERNAL', productName: 'Tata Tiscon Steel Rods (12mm)' },
  { id: '8', reference: 'ADJ/001', date: '2026-09-10', contact: 'Mohan Lal (Audit)', from: 'Virtual/Adjustment', to: 'ALM/Bay1', quantity: 2, status: 'Done', moveType: 'ADJUSTMENT', productName: 'Almora Handcrafted Copper Vessel' },
];

export const mockAdjustments: StockAdjustment[] = [
  { id: '1', productId: '6', productName: 'Almora Handcrafted Copper Vessel', location: 'ALM/Bay1', recordedQty: 78, countedQty: 80, difference: 2, date: '2026-09-10', adjustedBy: 'Ram Kumar' },
  { id: '2', productId: '1', productName: 'Dehradun Sheesham Wood Desk', location: 'DED/Stock1', recordedQty: 51, countedQty: 50, difference: -1, date: '2026-09-12', adjustedBy: 'Mohan Lal' },
];

export const mockTransfers: InternalTransfer[] = [
  { id: '1', reference: 'INT/001', from: 'DED/Stock1', to: 'PLP/Floor', product: 'Tata Tiscon Steel Rods (12mm)', quantity: 200, date: '2026-09-15', status: 'Done' },
  { id: '2', reference: 'INT/002', from: 'PLP/Floor', to: 'DHM/RackA', product: 'Kangra Organic Green Tea Packets', quantity: 50, date: '2026-09-28', status: 'Ready' },
  { id: '3', reference: 'INT/003', from: 'ALM/Bay1', to: 'DED/Stock1', product: 'Almora Handcrafted Copper Vessel', quantity: 15, date: '2026-10-01', status: 'Draft' },
];
