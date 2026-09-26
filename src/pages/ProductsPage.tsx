import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertCircle, ArrowUpDown } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { SearchBar } from '@/components/common/SearchBar';
import { Product } from '@/types';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const context = useInventory();
  const rawProducts = (context?.products || []);
  const updateProduct = context?.updateProduct;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = rawProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [rawProducts, searchQuery, sortField, sortDirection]);

  const handleDoubleClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setEditingId(product.id);
    setEditValue(product.onHand.toString());
  };

  const handleEditSave = (productId: string) => {
    const numValue = parseFloat(editValue);
    const productToUpdate = rawProducts.find(p => p.id === productId);
    if (!isNaN(numValue) && updateProduct && productToUpdate) {
      updateProduct({ ...productToUpdate, onHand: numValue });
    }
    setEditingId(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, productId: string) => {
    if (e.key === 'Enter') {
      handleEditSave(productId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          Stock
        </h1>
        <button
          onClick={() => navigate('/products/new')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Product</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="w-full md:w-1/2 lg:w-1/3 mb-6">
          <SearchBar 
            value={searchQuery}
            onChange={(val: string) => setSearchQuery(val)}
            placeholder="Search products..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { field: 'name', label: 'Product' },
                  { field: 'perUnitCost', label: 'Per Unit Cost' },
                  { field: 'onHand', label: 'On Hand' },
                  { field: 'freeToUse', label: 'Free to Use' }
                ].map((col) => (
                  <th 
                    key={col.field}
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(col.field as keyof Product)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.label}</span>
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <motion.tbody 
              className="bg-white divide-y divide-gray-200"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <AnimatePresence>
                {filteredAndSortedProducts.map((product) => (
                  <motion.tr 
                    key={product.id}
                    variants={rowVariants}
                    layout
                    onClick={() => {
                      if (editingId !== product.id) {
                        navigate(`/products/${product.id}`);
                      }
                    }}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center space-x-2">
                        <span>{product.name}</span>
                        {product.onHand < 10 && (
                          <span title="Low stock warning"><AlertCircle className="w-4 h-4 text-red-500" /></span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.perUnitCost} Rs
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      onDoubleClick={(e) => handleDoubleClick(e, product)}
                    >
                      {editingId === product.id ? (
                        <input
                          type="number"
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleEditSave(product.id)}
                          onKeyDown={(e) => handleEditKeyDown(e, product.id)}
                          className="border border-indigo-500 rounded px-2 py-1 w-20 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${product.onHand < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {product.onHand}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.freeToUse}
                    </td>
                  </motion.tr>
                ))}
                
                {filteredAndSortedProducts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
