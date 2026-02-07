import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/dashboard/StatsCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { HiCash, HiShoppingCart, HiClock, HiPlusCircle } from 'react-icons/hi';
import { formatCurrency } from '../../utils/formatters';
import orderService from '../../services/orderService';
import toast from 'react-hot-toast';

const CashierDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    pendingOrders: 0,
  });
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await orderService.getAll({ status: 'pending,preparing,ready' });
      setActiveOrders(response.data || []);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = response.data.filter(
        (order) => order.created_at.startsWith(today)
      );
      const todaySales = todayOrders.reduce(
        (sum, order) => sum + parseFloat(order.total_amount),
        0
      );
      
      setStats({
        todaySales,
        todayOrders: todayOrders.length,
        pendingOrders: response.data.filter((o) => o.status === 'pending').length,
      });
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cashier Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Manage orders and payments</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/pos')}
          className="gap-2"
        >
          <HiPlusCircle className="h-5 w-5" />
          New Order
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          title="Today's Sales"
          value={formatCurrency(stats.todaySales)}
          icon={HiCash}
          color="success"
        />
        <StatsCard
          title="Today's Orders"
          value={stats.todayOrders}
          icon={HiShoppingCart}
          color="primary"
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={HiClock}
          color="warning"
        />
      </div>

      {/* Active Orders */}
      <Card title="Active Orders" subtitle="Orders in progress">
        <div className="space-y-3">
          {activeOrders.length > 0 ? (
            activeOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-gray-900">
                        #{order.order_number}
                      </p>
                      <Badge
                        variant={
                          order.status === 'ready'
                            ? 'success'
                            : order.status === 'preparing'
                            ? 'primary'
                            : 'warning'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.customer_name || order.table?.table_number || 'No customer'}
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                  <Link to={`/orders/${order.id}`}>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <HiShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No active orders</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CashierDashboard;