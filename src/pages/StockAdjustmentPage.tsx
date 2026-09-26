import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { Modal } from '@/components/common/Modal';

export const StockAdjustmentPage: React.FC = () => {
  const { adjustments = [], products = [], locations = [], addAdjustment } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    location: '',
    countedQty: 0
  });

  const selectedProduct = products.find((p: any) => p.id === formData.productId);
  const recordedQty = selectedProduct ? selectedProduct.onHand : 0;
  const difference = formData.countedQty - recordedQty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addAdjustment) {
      addAdjustment({
        id: Date.now().toString(),
        productId: formData.productId,
        productName: selectedProduct?.name || '',
        location: formData.location,
        countedQty: formData.countedQty,
        recordedQty,
        difference,
        date: new Date().toISOString(),
        adjustedBy: 'System User' // Mock user
      });
    }
    setIsModalOpen(false);
    setFormData({ productId: '', location: '', countedQty: 0 });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Adjustments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track inventory counts</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Adjustment
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Recorded Qty</th>
                <th className="px-6 py-4 font-medium">Counted Qty</th>
                <th className="px-6 py-4 font-medium">Difference</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Adjusted By</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-gray-100"
            >
              {adjustments.length > 0 ? (
                adjustments.map((adj: any) => (
                  <motion.tr variants={itemVariants} key={adj.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {products.find((p: any) => p.id === adj.productId)?.name || adj.productId}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {locations.find((l: any) => l.id === adj.location)?.name || adj.location}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{adj.recordedQty}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{adj.countedQty}</td>
                    <td className={`px-6 py-4 font-medium ${adj.difference > 0 ? 'text-green-600' : adj.difference < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      {adj.difference > 0 ? '+' : ''}{adj.difference}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(adj.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{adj.adjustedBy}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No stock adjustments recorded.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Stock Adjustment">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select 
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({...formData, productId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a product...</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a location...</option>
                  {locations.map((l: any) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recorded Quantity</label>
                  <input 
                    type="number" 
                    readOnly 
                    value={recordedQty}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Counted Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.countedQty}
                    onChange={(e) => setFormData({...formData, countedQty: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {formData.productId && (
                <div className={`p-3 rounded-lg border ${difference > 0 ? 'bg-green-50 border-green-200 text-green-700' : difference < 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                  <p className="text-sm font-medium">
                    Difference: {difference > 0 ? '+' : ''}{difference} units
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StockAdjustmentPage;
