import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Hash, Building2 } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';

export const LocationsPage: React.FC = () => {
  const { locations = [], warehouses = [], addLocation } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    warehouseId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addLocation) {
      addLocation({ ...formData, id: `loc-${Date.now()}` });
    }
    setFormData({ name: '', shortCode: '', warehouseId: '' });
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
        <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
        <p className="text-sm text-gray-500 mt-1">This holds the multiple locations of warehouse, rooms etc.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Add New Location
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rack A1"
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
                  placeholder="e.g. LOC-A1"
                  value={formData.shortCode}
                  onChange={(e) => setFormData({...formData, shortCode: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Warehouse</label>
                <select 
                  required
                  value={formData.warehouseId}
                  onChange={(e) => setFormData({...formData, warehouseId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
                >
                  <option value="">Select a warehouse...</option>
                  {warehouses.map((wh: any) => (
                    <option key={wh.id} value={wh.id}>{wh.name} ({wh.shortCode})</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium mt-2"
              >
                <Plus className="w-4 h-4" />
                Save Location
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
            {locations.length > 0 ? (
              locations.map((loc: any) => (
                <motion.div 
                  variants={cardVariants}
                  key={loc.id} 
                  className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{loc.name}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600">
                        <Hash className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Code</span>
                      </div>
                      <span className="font-medium text-gray-900">{loc.shortCode}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Warehouse</span>
                      </div>
                      <span className="font-medium text-gray-900 truncate max-w-[120px]" title={warehouses.find((w: any) => w.id === loc.warehouseId)?.name}>
                        {warehouses.find((w: any) => w.id === loc.warehouseId)?.name || loc.warehouseId}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No locations yet</h3>
                <p className="text-gray-500 mt-1">Create your first location by filling out the form.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;
