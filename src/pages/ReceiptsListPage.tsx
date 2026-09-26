import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, LayoutList, LayoutGrid } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { Receipt } from '@/types';

// Assuming SearchBar, ViewToggle, StatusBadge are generic and we can implement simple fallbacks if they are not complex, or just import them as requested.
// We will just use the requested imports.
import { SearchBar } from '@/components/common/SearchBar';
import { ViewToggle } from '@/components/common/ViewToggle';
import { StatusBadge } from '@/components/common/StatusBadge';

const ReceiptsListPage: React.FC = () => {
  const { receipts } = useInventory();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const filteredReceipts = useMemo(() => {
    return receipts.filter((r: Receipt) => {
      const matchRef = r.reference?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchContact = r.contact?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRef || matchContact;
    });
  }, [receipts, searchQuery]);

  const columns = ['Draft', 'Ready', 'Done'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-800">Receipts</h1>
          <button
            onClick={() => navigate('/operations/receipts/new')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New
          </button>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search reference or contact..." 
          />
          <ViewToggle 
            view={viewMode} 
            onChange={setViewMode} 
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReceipts.map((receipt, index) => (
                  <motion.tr
                    key={receipt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/operations/receipts/${receipt.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{receipt.reference}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{receipt.from || 'Vendor'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{receipt.to || 'WH/Stock'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{receipt.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{receipt.scheduleDate || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={receipt.status} />
                    </td>
                  </motion.tr>
                ))}
                {filteredReceipts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No receipts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex space-x-6 overflow-x-auto pb-4"
          >
            {columns.map((colStatus) => (
              <div key={colStatus} className="flex-1 min-w-[300px] bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-4 flex justify-between items-center">
                  {colStatus}
                  <span className="bg-gray-200 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {filteredReceipts.filter(r => r.status === colStatus).length}
                  </span>
                </h3>
                <div className="space-y-4">
                  {filteredReceipts
                    .filter(r => r.status === colStatus)
                    .map((receipt, index) => (
                      <motion.div
                        key={receipt.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => navigate(`/operations/receipts/${receipt.id}`)}
                        className="bg-white p-4 rounded shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-blue-600">{receipt.reference}</span>
                        </div>
                        <div className="text-sm text-gray-900 font-medium mb-1">{receipt.contact || 'No Contact'}</div>
                        <div className="text-xs text-gray-500 mb-2">{receipt.scheduleDate || 'No Date'}</div>
                        <StatusBadge status={receipt.status} />
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReceiptsListPage;
