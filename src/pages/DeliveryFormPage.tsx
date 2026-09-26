import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ArrowLeft, AlertCircle } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { useAuth } from '@/context/AuthContext';
import { Delivery, OperationItem, DeliveryStatus } from '@/types';

const DeliveryFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deliveries, products, addDelivery, updateDeliveryStatus, getNextDeliveryRef, addStockMove } = useInventory();
  const { currentUser } = useAuth();

  const isNew = id === 'new' || !id;

  const [formData, setFormData] = useState<Partial<Delivery>>({
    reference: '',
    contact: '',
    scheduleDate: '',
    responsible: currentUser?.name || '',
    operationType: 'Standard Delivery',
    status: 'Draft',
    items: [],
    from: 'WH/Stock',
    to: 'Customer'
  });

  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      setFormData(prev => ({ ...prev, reference: getNextDeliveryRef() }));
    } else {
      const existing = deliveries.find(d => d.id === id);
      if (existing) {
        setFormData(existing);
      } else {
        navigate('/operations/deliveries');
      }
    }
  }, [id, isNew, deliveries, getNextDeliveryRef, navigate]);

  const isReadOnly = formData.status === 'Done' || formData.status === 'Cancelled';

  const handleAddItem = () => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), { productId: '', quantity: 1 } as OperationItem]
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (isReadOnly) return;
    setFormData(prev => {
      const newItems = [...(prev.items || [])];
      newItems.splice(index, 1);
      return { ...prev, items: newItems };
    });
  };

  const handleItemChange = (index: number, field: keyof OperationItem, value: any) => {
    if (isReadOnly) return;
    setFormData(prev => {
      const newItems = [...(prev.items || [])];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const handleSave = () => {
    if (isNew) {
      const newDelivery = {
        ...formData,
        id: `delivery-${Date.now()}`
      } as Delivery;
      addDelivery(newDelivery);
      navigate(`/operations/deliveries/${newDelivery.id}`);
    }
  };

  const handleValidate = () => {
    setAlertMsg(null);
    if (formData.status === 'Draft' || formData.status === 'Waiting') {
      let isInsufficient = false;
      
      formData.items?.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod && (prod.freeToUse || 0) < item.quantity) {
          isInsufficient = true;
        }
      });

      if (isInsufficient) {
        setAlertMsg('Product not in stock');
        const updated = { ...formData, status: 'Waiting' as DeliveryStatus };
        setFormData(updated);
        if (!isNew && id) updateDeliveryStatus(id, 'Waiting');
      } else {
        const updated = { ...formData, status: 'Ready' as DeliveryStatus };
        setFormData(updated);
        if (!isNew && id) updateDeliveryStatus(id, 'Ready');
      }
    } else if (formData.status === 'Ready') {
      const updated = { ...formData, status: 'Done' as DeliveryStatus };
      setFormData(updated);
      if (!isNew && id) {
        updateDeliveryStatus(id, 'Done');
        // Add stock moves OUT
        formData.items?.forEach(item => {
          if (item.productId && item.quantity > 0) {
            addStockMove({
              id: `move-out-${Date.now()}-${Math.random()}`,
              reference: formData.reference || '',
              date: new Date().toISOString().split('T')[0],
              contact: formData.contact || '',
              from: formData.from || 'WH/Stock',
              to: formData.to || 'Customer',
              quantity: item.quantity,
              status: 'Done',
              moveType: 'OUT',
              productName: products.find(p => p.id === item.productId)?.name || '',
              productId: item.productId
            });
          }
        });
      }
    }
  };

  const handleCancel = () => {
    if (!isNew && id) {
      updateDeliveryStatus(id, 'Cancelled');
      setFormData(prev => ({ ...prev, status: 'Cancelled' }));
    } else {
      navigate('/operations/deliveries');
    }
  };

  const flowSteps: DeliveryStatus[] = ['Draft', 'Waiting', 'Ready', 'Done'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto"
    >
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate('/operations/deliveries')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Delivery</h1>
        <button 
          onClick={() => navigate('/operations/deliveries/new')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md transition-colors font-medium"
        >
          New
        </button>
      </div>

      {alertMsg && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 text-red-600 p-4 rounded-md flex items-center mb-4 shadow-sm"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          {alertMsg}
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header toolbar */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="space-x-2">
            {!isReadOnly && formData.status !== 'Cancelled' && (
              <button 
                onClick={handleValidate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Validate
              </button>
            )}
            <button 
              disabled={formData.status !== 'Done'}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Print
            </button>
            {!isReadOnly && formData.status !== 'Cancelled' && (
              <button 
                onClick={handleCancel}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            )}
            {isNew && (
              <button 
                onClick={handleSave}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors ml-2"
              >
                Save
              </button>
            )}
          </div>
          
          <div className="flex space-x-1">
            {flowSteps.map((step, idx) => (
              <div key={step} className="flex items-center">
                <div className={`px-3 py-1 text-sm rounded-full font-medium ${formData.status === step ? 'bg-blue-100 text-blue-800 border border-blue-200' : formData.status === 'Cancelled' ? 'bg-red-50 text-red-400' : 'text-gray-400'}`}>
                  {step}
                </div>
                {idx < flowSteps.length - 1 && (
                  <span className="mx-1 text-gray-300 text-sm">{'>'}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">{formData.reference}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
              <input
                type="text"
                value={formData.contact || ''}
                onChange={e => setFormData({...formData, contact: e.target.value})}
                disabled={isReadOnly}
                className="w-full border-b border-gray-300 focus:border-blue-500 focus:ring-0 px-0 py-1 bg-transparent disabled:text-gray-500"
                placeholder="Customer Name or Address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label>
              <input
                type="date"
                value={formData.scheduleDate || ''}
                onChange={e => setFormData({...formData, scheduleDate: e.target.value})}
                disabled={isReadOnly}
                className="w-full border-b border-gray-300 focus:border-blue-500 focus:ring-0 px-0 py-1 bg-transparent disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operation Type</label>
              <select
                value={formData.operationType || 'Standard Delivery'}
                onChange={e => setFormData({...formData, operationType: e.target.value})}
                disabled={isReadOnly}
                className="w-full border-b border-gray-300 focus:border-blue-500 focus:ring-0 px-0 py-1 bg-transparent disabled:text-gray-500"
              >
                <option value="Standard Delivery">Standard Delivery</option>
                <option value="Express Delivery">Express Delivery</option>
                <option value="Return">Return</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsible</label>
              <input
                type="text"
                value={formData.responsible || ''}
                onChange={e => setFormData({...formData, responsible: e.target.value})}
                disabled={isReadOnly}
                className="w-full border-b border-gray-300 focus:border-blue-500 focus:ring-0 px-0 py-1 bg-transparent disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Products List */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">Products</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/3">Product</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Quantity</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {(formData.items || []).map((item, index) => {
                      const prod = products.find(p => p.id === item.productId);
                      const outOfStock = prod && (prod.freeToUse || 0) < item.quantity;
                      
                      return (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={outOfStock ? 'bg-red-50' : ''}
                        >
                          <td className="px-3 py-2">
                            <select
                              value={item.productId || ''}
                              onChange={e => handleItemChange(index, 'productId', e.target.value)}
                              disabled={isReadOnly}
                              className={`w-full rounded-md shadow-sm sm:text-sm disabled:bg-gray-50 ${outOfStock ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                            >
                              <option value="">Select product...</option>
                              {products.map(p => (
                                <option key={p.id} value={p.id}>
                                  [{p.sku}] {p.name} {p.freeToUse !== undefined ? `(Avail: ${p.freeToUse})` : ''}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity || 1}
                              onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                              disabled={isReadOnly}
                              className={`w-full rounded-md shadow-sm sm:text-sm disabled:bg-gray-50 ${outOfStock ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            {!isReadOnly && (
                              <button
                                onClick={() => handleRemoveItem(index)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
              
              {!isReadOnly && (
                <button
                  onClick={handleAddItem}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add New Product
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeliveryFormPage;
