import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Building2, MapPin, Hash } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';

export const WarehousePage: React.FC = () => {
  const { warehouses = [], addWarehouse } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addWarehouse) {
      addWarehouse({ ...formData, id: `wh-${Date.now()}` });
    }
    setFormData({ name: '', shortCode: '', address: '' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Warehouse</h1>
        <p className="text-sm text-gray-500 mt-1">This page contains the warehouse details & location.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Add New Warehouse
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Main Warehouse"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. WH-MAIN"
                  value={formData.shortCode}
                  onChange={(e) => setFormData({...formData, shortCode: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Full physical address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium mt-2"
              >
                <Plus className="w-4 h-4" />
                Save Warehouse
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {warehouses.length > 0 ? (
              warehouses.map((wh: any) => (
                <motion.div 
                  variants={cardVariants}
                  key={wh.id} 
                  className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{wh.name}</h3>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors text-sm font-medium">Edit</button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <Hash className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium text-gray-900">{wh.shortCode}</span>
                    </div>
                    <div className="flex items-start text-sm text-gray-600 p-2">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{wh.address}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No warehouses yet</h3>
                <p className="text-gray-500 mt-1">Add your first warehouse using the form on the left.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WarehousePage;
