import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Product, Warehouse, Location, Receipt, Delivery, StockMove, StockAdjustment, InternalTransfer,
  ReceiptStatus, DeliveryStatus
} from '../types';
import { 
  mockProducts, mockWarehouses, mockLocations, mockReceipts, mockDeliveries, 
  mockStockMoves, mockAdjustments, mockTransfers 
} from '../data/mockData';

interface InventoryContextType {
  products: Product[];
  warehouses: Warehouse[];
  locations: Location[];
  receipts: Receipt[];
  deliveries: Delivery[];
  stockMoves: StockMove[];
  adjustments: StockAdjustment[];
  transfers: InternalTransfer[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  addWarehouse: (warehouse: Warehouse) => void;
  addLocation: (location: Location) => void;
  addReceipt: (receipt: Omit<Receipt, 'id' | 'reference'>) => void;
  updateReceiptStatus: (id: string, status: ReceiptStatus) => void;
  addDelivery: (delivery: Omit<Delivery, 'id' | 'reference'>) => void;
  updateDeliveryStatus: (id: string, status: DeliveryStatus) => void;
  addStockMove: (move: StockMove) => void;
  addAdjustment: (adjustment: StockAdjustment) => void;
  addTransfer: (transfer: InternalTransfer) => void;
  getNextReceiptRef: () => string;
  getNextDeliveryRef: () => string;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses);
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [stockMoves, setStockMoves] = useState<StockMove[]>(mockStockMoves);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(mockAdjustments);
  const [transfers, setTransfers] = useState<InternalTransfer[]>(mockTransfers);

  const addProduct = (product: Product) => setProducts([...products, product]);
  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  const addWarehouse = (warehouse: Warehouse) => setWarehouses([...warehouses, warehouse]);
  const addLocation = (location: Location) => setLocations([...locations, location]);

  const getNextReceiptRef = () => {
    const count = receipts.length + 1;
    return `WH/IN/${count.toString().padStart(4, '0')}`;
  };

  const getNextDeliveryRef = () => {
    const count = deliveries.length + 1;
    return `WH/OUT/${count.toString().padStart(4, '0')}`;
  };

  const addReceipt = (receipt: Omit<Receipt, 'id' | 'reference'>) => {
    const newReceipt: Receipt = {
      ...receipt,
      id: Date.now().toString(),
      reference: getNextReceiptRef(),
    };
    setReceipts([...receipts, newReceipt]);
  };

  const updateReceiptStatus = (id: string, status: ReceiptStatus) => {
    setReceipts(prev => prev.map(r => {
      if (r.id === id) {
        if (status === 'Done' && r.status !== 'Done') {
          // Increase stock
          const newProducts = [...products];
          r.items.forEach(item => {
            const product = newProducts.find(p => p.id === item.productId);
            if (product) {
              product.onHand += item.quantity;
              product.freeToUse += item.quantity;
            }
          });
          setProducts(newProducts);
        }
        return { ...r, status };
      }
      return r;
    }));
  };

  const addDelivery = (delivery: Omit<Delivery, 'id' | 'reference'>) => {
    const newDelivery: Delivery = {
      ...delivery,
      id: Date.now().toString(),
      reference: getNextDeliveryRef(),
    };
    setDeliveries([...deliveries, newDelivery]);
  };

  const updateDeliveryStatus = (id: string, status: DeliveryStatus) => {
    setDeliveries(prev => prev.map(d => {
      if (d.id === id) {
        if (status === 'Done' && d.status !== 'Done') {
          // Decrease stock
          const newProducts = [...products];
          d.items.forEach(item => {
            const product = newProducts.find(p => p.id === item.productId);
            if (product) {
              product.onHand -= item.quantity;
              product.freeToUse -= item.quantity;
            }
          });
          setProducts(newProducts);
        } else {
          // Check stock
          let isWaiting = false;
          d.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product && product.freeToUse < item.quantity) {
              isWaiting = true;
            }
          });
          if (isWaiting && status !== 'Done') {
            status = 'Waiting';
          }
        }
        return { ...d, status };
      }
      return d;
    }));
  };

  const addStockMove = (move: StockMove) => setStockMoves([...stockMoves, move]);
  
  const addAdjustment = (adjustment: StockAdjustment) => {
    setAdjustments([...adjustments, adjustment]);
    const newProducts = [...products];
    const product = newProducts.find(p => p.id === adjustment.productId);
    if (product) {
      product.onHand += adjustment.difference;
      product.freeToUse += adjustment.difference;
      setProducts(newProducts);
    }
  };

  const addTransfer = (transfer: InternalTransfer) => setTransfers([...transfers, transfer]);

  return (
    <InventoryContext.Provider value={{
      products, warehouses, locations, receipts, deliveries, stockMoves, adjustments, transfers,
      addProduct, updateProduct, addWarehouse, addLocation, addReceipt, updateReceiptStatus,
      addDelivery, updateDeliveryStatus, addStockMove, addAdjustment, addTransfer,
      getNextReceiptRef, getNextDeliveryRef
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
