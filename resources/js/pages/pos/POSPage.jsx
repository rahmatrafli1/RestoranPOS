import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCustomerInfo,
  setOrderType,
} from '../../store/slices/cartSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import MenuItemCard from './components/MenuItemCard';
import CartSummary from './components/CartSummary';
import OrderTypeSelector from './components/OrderTypeSelector';
import TableSelector from './components/TableSelector';
import PaymentModal from './components/PaymentModal';
import menuService from '../../services/menuService';
import categoryService from '../../services/categoryService';
import tableService from '../../services/tableService';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { HiSearch, HiShoppingCart, HiX } from 'react-icons/hi';

const POSPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTableSelector, setShowTableSelector] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuRes, categoryRes, tableRes] = await Promise.all([
        menuService.getAll(),
        categoryService.getAll(),
        tableService.getAll(),
      ]);
      setMenuItems(menuRes.data || []);
      setCategories(categoryRes.data || []);
      setTables(tableRes.data || []);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    toast.success(`${item.name} added to cart`);
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success('Item removed from cart');
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(itemId);
      return;
    }
    dispatch(updateQuantity({ id: itemId, quantity }));
  };

  const handleOrderTypeChange = (type) => {
    dispatch(setOrderType(type));
    if (type === 'dine_in') {
      setShowTableSelector(true);
    }
  };

  const handleTableSelect = (table) => {
    dispatch(setCustomerInfo({ table_id: table.id, customer_name: `Table ${table.table_number}` }));
    setShowTableSelector(false);
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (cart.orderType === 'dine_in' && !cart.table_id) {
      toast.error('Please select a table');
      setShowTableSelector(true);
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Create order
      const orderData = {
        order_type: cart.orderType,
        table_id: cart.table_id,
        customer_name: cart.customer_name,
        items: cart.items.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes || '',
        })),
        subtotal: cart.subtotal,
        tax: cart.tax,
        discount: cart.discount,
        total_amount: cart.total,
        payment_method: paymentData.payment_method,
        paid_amount: paymentData.paid_amount,
        change_amount: paymentData.change_amount,
      };

      const response = await orderService.create(orderData);
      
      toast.success('Order created successfully!');
      dispatch(clearCart());
      setShowPaymentModal(false);

      // Navigate to order detail or print receipt
      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
      console.error(error);
    }
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.is_available) return false;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <Loading fullScreen text="Loading POS..." />;
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Left Side - Menu Items */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Point of Sale</h1>
          <p className="text-sm text-gray-600">Select items to create an order</p>
        </div>

        {/* Order Type Selector */}
        <div className="mb-4">
          <OrderTypeSelector
            selectedType={cart.orderType}
            onTypeChange={handleOrderTypeChange}
            tableName={cart.table_id ? `Table ${tables.find(t => t.id === cart.table_id)?.table_number}` : null}
          />
        </div>

        {/* Search & Category Filter */}
        <Card className="mb-4">
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id.toString())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id.toString()
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
            {filteredMenuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredMenuItems.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500">
                <HiSearch className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="font-medium">No items found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-96 flex flex-col">
        <CartSummary
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={handleCheckout}
          onClearCart={() => dispatch(clearCart())}
        />
      </div>

      {/* Table Selector Modal */}
      <Modal
        isOpen={showTableSelector}
        onClose={() => setShowTableSelector(false)}
        title="Select Table"
        size="lg"
      >
        <TableSelector
          tables={tables.filter((t) => t.status === 'available')}
          onSelectTable={handleTableSelect}
          onCancel={() => setShowTableSelector(false)}
        />
      </Modal>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cart={cart}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default POSPage;