import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { Modal } from '@/components/common/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';

export const InternalTransfersPage: React.FC = () => {
  const { transfers = [], products = [], locations = [], addTransfer } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    product: '',
    quantity: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addTransfer) {
      addTransfer({
        ...formData,
        id: Date.now().toString(),
        reference: `TRF/${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        status: 'Done'
      });
    }
    setIsModalOpen(false);
    setFormData({ from: '', to: '', product: '', quantity: 1 });
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
          <h1 className="text-2xl font-bold text-gray-900">Internal Transfers</h1>
          <p className="text-sm text-gray-500 mt-1">Move stock between internal locations</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Transfer
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">Reference</th>
                <th className="px-6 py-4 font-medium">From</th>
                <th className="px-6 py-4 font-medium">To</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Quantity</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-gray-100"
            >
              {transfers.length > 0 ? (
                transfers.map((trf: any) => (
                  <motion.tr variants={itemVariants} key={trf.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{trf.reference}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {locations.find((l: any) => l.id === trf.from)?.name || trf.from}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {locations.find((l: any) => l.id === trf.to)?.name || trf.to}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {products.find((p: any) => p.id === trf.product)?.name || trf.product}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{trf.quantity}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(trf.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={trf.status} />
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No internal transfers recorded.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Internal Transfer">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Location</label>
                  <select 
                    required
                    value={formData.from}
                    onChange={(e) => setFormData({...formData, from: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select origin...</option>
                    {locations.map((l: any) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-6 text-gray-400">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Location</label>
                  <select 
                    required
                    value={formData.to}
                    onChange={(e) => setFormData({...formData, to: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select destination...</option>
                    {locations.map((l: any) => (
                      <option key={l.id} value={l.id} disabled={l.id === formData.from}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select 
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a product...</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

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
                  Confirm Transfer
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InternalTransfersPage;
