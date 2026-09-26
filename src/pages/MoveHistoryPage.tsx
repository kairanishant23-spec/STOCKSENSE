import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { SearchBar } from '@/components/common/SearchBar';
import { ViewToggle } from '@/components/common/ViewToggle';
import { StatusBadge } from '@/components/common/StatusBadge';

export const MoveHistoryPage: React.FC = () => {
  const { stockMoves = [] } = useInventory();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Expand stock moves if they have multiple products (assuming items array or similar)
  // For safety, we'll cast or handle basic structure
  const expandedMoves = stockMoves.flatMap((move: any) => {
    if (move.items && Array.isArray(move.items) && move.items.length > 0) {
      return move.items.map((item: any) => ({
        ...move,
        quantity: item.quantity || move.quantity,
        productId: item.productId,
        _rowId: `${move.id}-${item.productId}`,
      }));
    }
    return [{ ...move, _rowId: move.id }];
  });

  const filteredMoves = expandedMoves.filter((move: any) => {
    const term = searchQuery.toLowerCase();
    return (
      (move.reference && move.reference.toLowerCase().includes(term)) ||
      (move.contact && move.contact.toLowerCase().includes(term))
    );
  });

  const getMoveColor = (reference: string) => {
    if (reference?.includes('/IN/')) return 'text-green-600 font-medium';
    if (reference?.includes('/OUT/')) return 'text-red-600 font-medium';
    return 'text-gray-900';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Group by status for Kanban
  const kanbanGroups = filteredMoves.reduce((acc: any, move: any) => {
    const status = move.status || 'Pending';
    if (!acc[status]) acc[status] = [];
    acc[status].push(move);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Move History</h1>
          <p className="text-sm text-gray-500 mt-1">Track inbound and outbound stock movements</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            NEW
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="w-full sm:w-96">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search by reference or contact..." 
          />
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`p-2 rounded-md transition-colors ${view === 'kanban' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="px-6 py-4 font-medium">Reference</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">From</th>
                  <th className="px-6 py-4 font-medium">To</th>
                  <th className="px-6 py-4 font-medium">Quantity</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={containerVariants} 
                initial="hidden" 
                animate="visible"
                className="divide-y divide-gray-100"
              >
                {filteredMoves.length > 0 ? (
                  filteredMoves.map((move: any) => (
                    <motion.tr variants={itemVariants} key={move._rowId} className="hover:bg-gray-50 transition-colors">
                      <td className={`px-6 py-4 whitespace-nowrap ${getMoveColor(move.reference)}`}>
                        {move.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {new Date(move.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{move.contact || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{move.fromLocation || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{move.toLocation || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {move.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={move.status} />
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No stock moves found.
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="flex gap-6 overflow-x-auto pb-4"
        >
          {Object.entries(kanbanGroups).map(([status, moves]: [string, any]) => (
            <div key={status} className="bg-gray-50 rounded-xl p-4 min-w-[300px] border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
                {status}
                <span className="bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {moves.length}
                </span>
              </h3>
              <div className="space-y-3">
                {moves.map((move: any) => (
                  <motion.div
                    variants={itemVariants}
                    key={move._rowId}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm ${getMoveColor(move.reference)}`}>
                        {move.reference}
                      </span>
                      <StatusBadge status={move.status} />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium text-gray-900">{move.contact || '-'}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                      <span>{new Date(move.date).toLocaleDateString()}</span>
                      <span className="font-medium text-gray-900">Qty: {move.quantity}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MoveHistoryPage;
