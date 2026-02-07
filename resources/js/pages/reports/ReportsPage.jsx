import React, { useState, useEffect } from 'react';
import { HiDownload, HiRefresh, HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import reportService from '../../services/reportService';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState({
    summary: {},
    topProducts: [],
    salesByType: [],
    hourlyStats: [],
  });

  useEffect(() => {
    fetchReports();
  }, [dateRange, startDate, endDate]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};

      if (dateRange === 'custom') {
        params.start_date = startDate;
        params.end_date = endDate;
      } else {
        params.period = dateRange;
      }

      const response = await reportService.getSalesReport(params);
      setData(response.data || {
        summary: {},
        topProducts: [],
        salesByType: [],
        hourlyStats: [],
      });
    } catch (error) {
      toast.error('Failed to load reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (dateRange === 'custom') {
        params.start_date = startDate;
        params.end_date = endDate;
      } else {
        params.period = dateRange;
      }

      await reportService.exportSalesReport(params);
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading reports..." />;
  }

  const summary = data.summary || {};

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">View sales reports and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchReports} className="gap-2">
            <HiRefresh className="h-5 w-5" />
            Refresh
          </Button>
          <Button variant="primary" onClick={handleExport} className="gap-2">
            <HiDownload className="h-5 w-5" />
            Export
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Period</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-input"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div>
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.total_sales || 0)}
            </p>
            {summary.sales_change !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                {summary.sales_change >= 0 ? (
                  <>
                    <HiTrendingUp className="h-4 w-4 text-success-600" />
                    <span className="text-success-600">
                      +{summary.sales_change}%
                    </span>
                  </>
                ) : (
                  <>
                    <HiTrendingDown className="h-4 w-4 text-danger-600" />
                    <span className="text-danger-600">
                      {summary.sales_change}%
                    </span>
                  </>
                )}
                <span className="text-gray-500">vs previous period</span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(summary.total_orders || 0)}
            </p>
            <p className="text-xs text-gray-500">
              Avg: {formatCurrency(summary.average_order_value || 0)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Completed Orders</p>
            <p className="text-2xl font-bold text-success-600">
              {formatNumber(summary.completed_orders || 0)}
            </p>
            <p className="text-xs text-gray-500">
              {summary.completion_rate || 0}% completion rate
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Cancelled Orders</p>
            <p className="text-2xl font-bold text-danger-600">
              {formatNumber(summary.cancelled_orders || 0)}
            </p>
            <p className="text-xs text-gray-500">
              {summary.cancellation_rate || 0}% cancellation rate
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card title="Top Selling Products">
          <div className="space-y-3">
            {data.topProducts?.length > 0 ? (
              data.topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatNumber(product.quantity)} sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No data available</p>
            )}
          </div>
        </Card>

        {/* Sales by Type */}
        <Card title="Sales by Order Type">
          <div className="space-y-3">
            {data.salesByType?.length > 0 ? (
              data.salesByType.map((type, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900 capitalize">
                      {type.type.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(type.total)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${type.percentage || 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatNumber(type.count)} orders</span>
                    <span>{type.percentage || 0}%</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No data available</p>
            )}
          </div>
        </Card>
      </div>

      {/* Hourly Statistics */}
      {data.hourlyStats?.length > 0 && (
        <Card title="Sales by Hour">
          <div className="overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {data.hourlyStats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center gap-2 min-w-[60px]">
                  <div
                    className="w-12 bg-primary-100 rounded-t"
                    style={{
                      height: `${(stat.total / Math.max(...data.hourlyStats.map(s => s.total))) * 120}px`,
                      minHeight: '20px',
                    }}
                  >
                    <div className="w-full h-full bg-primary-600 rounded-t" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-900">
                      {formatCurrency(stat.total)}
                    </p>
                    <p className="text-xs text-gray-500">{stat.hour}:00</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsPage;