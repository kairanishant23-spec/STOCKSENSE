import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Search, User, LogOut, Package, LayoutDashboard, ArrowLeftRight, History, Settings, ClipboardList, Truck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-blue-600 bg-blue-50 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600'
        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
    }`;

  const dropdownClass = "absolute z-10 top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden";

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">StockSense</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <NavLink to="/dashboard" className={navItemClass}>
                <LayoutDashboard className="w-4 h-4 mr-1" />
                <span>Dashboard</span>
              </NavLink>

              {/* Operations Dropdown */}
              <div 
                className="relative flex items-center"
                onMouseEnter={() => setOpenDropdown('operations')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                  <ArrowLeftRight className="w-4 h-4 mr-1" />
                  <span>Operations</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                <AnimatePresence>
                  {openDropdown === 'operations' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={dropdownClass}
                    >
                      <div className="py-1">
                        <NavLink to="/operations/receipts" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <ClipboardList className="w-4 h-4 mr-2" />
                          Receipts
                        </NavLink>
                        <NavLink to="/operations/deliveries" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Truck className="w-4 h-4 mr-2" />
                          Deliveries
                        </NavLink>
                        <NavLink to="/operations/adjustments" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Package className="w-4 h-4 mr-2" />
                          Adjustments
                        </NavLink>
                        <NavLink to="/transfers" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <ArrowLeftRight className="w-4 h-4 mr-2" />
                          Transfers
                        </NavLink>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/products" className={navItemClass}>
                <Package className="w-4 h-4 mr-1" />
                <span>Products</span>
              </NavLink>

              <NavLink to="/move-history" className={navItemClass}>
                <History className="w-4 h-4 mr-1" />
                <span>Move History</span>
              </NavLink>

              {/* Settings Dropdown */}
              <div 
                className="relative flex items-center"
                onMouseEnter={() => setOpenDropdown('settings')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                  <Settings className="w-4 h-4 mr-1" />
                  <span>Settings</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                <AnimatePresence>
                  {openDropdown === 'settings' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={dropdownClass}
                    >
                      <div className="py-1">
                        <NavLink to="/settings/warehouse" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Warehouse
                        </NavLink>
                        <NavLink to="/settings/locations" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Locations
                        </NavLink>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
              <Search className="w-5 h-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition"
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </NavLink>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden overflow-hidden bg-white border-b border-gray-200"
          >
            <div className="pt-2 pb-3 space-y-1">
              <NavLink to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dashboard</NavLink>
              <div className="px-3 py-2 text-base font-medium text-gray-900 bg-gray-50">Operations</div>
              <NavLink to="/operations/receipts" className="block pl-6 pr-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">Receipts</NavLink>
              <NavLink to="/operations/deliveries" className="block pl-6 pr-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">Deliveries</NavLink>
              <NavLink to="/operations/adjustments" className="block pl-6 pr-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">Adjustments</NavLink>
              <NavLink to="/products" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Products</NavLink>
              <NavLink to="/move-history" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Move History</NavLink>
              <div className="px-3 py-2 text-base font-medium text-gray-900 bg-gray-50">Settings</div>
              <NavLink to="/settings/warehouse" className="block pl-6 pr-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">Warehouse</NavLink>
              <NavLink to="/settings/locations" className="block pl-6 pr-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">Locations</NavLink>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <NavLink to="/profile" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100">My Profile</NavLink>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100">Logout</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
