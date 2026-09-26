import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, Box, AlertTriangle, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  // We'll safely fallback to empty arrays/objects if context is missing
  const context = useInventory();
  const products = context?.products || [];
  const receipts = context?.receipts || [];
  const deliveries = context?.deliveries || [];

  const today = new Date().toISOString().split('T')[0];

  // Memoize KPI calculations
  const { 
    receiptsToReceive, 
    receiptsLate, 
    receiptsOperations,
    deliveriesToDeliver,
    deliveriesLate,
    deliveriesWaiting,
    deliveriesOperations,
    totalProducts,
    lowStockItems,
    pendingReceipts,
    pendingDeliveries
  } = useMemo(() => {
    const rPending = receipts.filter(r => r.status !== 'Done');
    const dPending = deliveries.filter(d => d.status !== 'Done');

    return {
      receiptsToReceive: rPending.length,
      receiptsLate: rPending.filter(r => r.scheduleDate < today).length,
      receiptsOperations: rPending.filter(r => r.scheduleDate >= today).length,
      
      deliveriesToDeliver: dPending.length,
      deliveriesLate: dPending.filter(d => d.scheduleDate < today).length,
      deliveriesWaiting: dPending.filter(d => d.status === 'Waiting').length,
      deliveriesOperations: dPending.filter(d => d.scheduleDate >= today).length,

      totalProducts: products.length,
      lowStockItems: products.filter(p => p.onHand < 10).length,
      pendingReceipts: rPending.length,
      pendingDeliveries: dPending.length
    };
  }, [products, receipts, deliveries, today]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-8">
          Dashboard
        </motion.h1>

        {/* Operation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Receipt Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Receipt</h2>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => navigate('/operations/receipts')}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
              >
                <ArrowDownToLine className="w-5 h-5" />
                <span>{receiptsToReceive} to receive</span>
              </button>
            </div>

            <div className="flex space-x-6 text-sm">
              <div className="flex flex-col">
                <span className="text-red-500 font-semibold">{receiptsLate} Late</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">{receiptsOperations} operations</span>
              </div>
            </div>
          </motion.div>

          {/* Delivery Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Truck className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Delivery</h2>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => navigate('/operations/deliveries')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
              >
                <ArrowUpFromLine className="w-5 h-5" />
                <span>{deliveriesToDeliver} to Deliver</span>
              </button>
            </div>

            <div className="flex space-x-6 text-sm">
              <div className="flex flex-col">
                <span className="text-red-500 font-semibold">{deliveriesLate} Late</span>
              </div>
              <div className="flex flex-col">
                <span className="text-orange-500 font-semibold">{deliveriesWaiting} waiting</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">{deliveriesOperations} operations</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Products in Stock</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center space-x-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-full">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center space-x-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <ArrowDownToLine className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Receipts</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReceipts}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <ArrowUpFromLine className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Deliveries</p>
              <p className="text-2xl font-bold text-gray-900">{pendingDeliveries}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
