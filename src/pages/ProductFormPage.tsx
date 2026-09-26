import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInventory } from '@/context/InventoryContext';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useInventory();
  
  const isEditMode = id !== undefined;
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Furniture',
    unitOfMeasure: 'Units',
    perUnitCost: 0,
    onHand: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && context?.products) {
      const product = context.products.find(p => p.id === id);
      if (product) {
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          category: product.category || 'Furniture',
          unitOfMeasure: product.unitOfMeasure || 'Units',
          perUnitCost: product.perUnitCost || 0,
          onHand: product.onHand || 0
        });
      }
    }
  }, [id, isEditMode, context?.products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'perUnitCost' || name === 'onHand' ? Number(value) : value
    }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.perUnitCost < 0) newErrors.perUnitCost = 'Cost cannot be negative';
    if (formData.onHand < 0) newErrors.onHand = 'Initial stock cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode && context?.updateProduct) {
      const productToUpdate = context.products.find(p => p.id === id);
      if (productToUpdate) {
        context.updateProduct({
          ...productToUpdate,
          name: formData.name,
          perUnitCost: formData.perUnitCost,
          onHand: formData.onHand,
          sku: formData.sku,
          category: formData.category,
          unitOfMeasure: formData.unitOfMeasure
        });
      }
    } else if (!isEditMode && context?.addProduct) {
      context.addProduct({
        id: Date.now().toString(),
        name: formData.name,
        perUnitCost: formData.perUnitCost,
        onHand: formData.onHand,
        freeToUse: formData.onHand,
        initialStock: formData.onHand,
        sku: formData.sku,
        category: formData.category,
        unitOfMeasure: formData.unitOfMeasure
      });
    }

    navigate('/products');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Product' : 'New Product'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
                placeholder="e.g. Ergonomic Office Desk"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* SKU Field */}
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                SKU / Code *
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow ${
                  errors.sku ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
                placeholder="e.g. DESK001"
              />
              {errors.sku && <p className="mt-1 text-sm text-red-500">{errors.sku}</p>}
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Unit Field */}
            <div>
              <label htmlFor="unitOfMeasure" className="block text-sm font-medium text-gray-700 mb-1">
                Unit of Measure
              </label>
              <select
                id="unitOfMeasure"
                name="unitOfMeasure"
                value={formData.unitOfMeasure}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Units">Units</option>
                <option value="Kg">Kg</option>
                <option value="Liters">Liters</option>
                <option value="Meters">Meters</option>
                <option value="Pieces">Pieces</option>
              </select>
            </div>

            {/* Cost Field */}
            <div>
              <label htmlFor="perUnitCost" className="block text-sm font-medium text-gray-700 mb-1">
                Per Unit Cost (Rs)
              </label>
              <input
                type="number"
                id="perUnitCost"
                name="perUnitCost"
                value={formData.perUnitCost}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow ${
                  errors.perUnitCost ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
              />
              {errors.perUnitCost && <p className="mt-1 text-sm text-red-500">{errors.perUnitCost}</p>}
            </div>

            {/* On Hand Field */}
            <div>
              <label htmlFor="onHand" className="block text-sm font-medium text-gray-700 mb-1">
                {isEditMode ? 'On Hand Stock' : 'Initial Stock'}
              </label>
              <input
                type="number"
                id="onHand"
                name="onHand"
                value={formData.onHand}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow ${
                  errors.onHand ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
              />
              {errors.onHand && <p className="mt-1 text-sm text-red-500">{errors.onHand}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
            >
              Save Product
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductFormPage;
