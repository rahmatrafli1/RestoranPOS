import React, { useEffect, useState } from 'react';
import { HiPlus, HiPencil, HiTrash, HiFilter } from 'react-icons/hi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import TableForm from './TableForm';
import tableService from '../../services/tableService';
import toast from 'react-hot-toast';

const TableList = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await tableService.getAll();
      setTables(response.data || []);
    } catch (error) {
      toast.error('Failed to load tables');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTable(null);
    setIsModalOpen(true);
  };

  const handleEdit = (table) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await tableService.delete(id);
      toast.success('Table deleted successfully');
      fetchTables();
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete table');
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedTable(null);
    fetchTables();
  };

  const filteredTables = tables.filter((table) => {
    const matchesLocation = filterLocation === 'all' || table.location === filterLocation;
    const matchesStatus = filterStatus === 'all' || table.status === filterStatus;
    return matchesLocation && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      available: 'success',
      occupied: 'danger',
      reserved: 'warning',
      maintenance: 'secondary',
    };
    return colors[status] || 'secondary';
  };

  const getTableColor = (status) => {
    const colors = {
      available: 'bg-success-50 border-success-300 hover:bg-success-100',
      occupied: 'bg-danger-50 border-danger-300 hover:bg-danger-100',
      reserved: 'bg-warning-50 border-warning-300 hover:bg-warning-100',
      maintenance: 'bg-gray-50 border-gray-300 hover:bg-gray-100',
    };
    return colors[status] || 'bg-gray-50 border-gray-300';
  };

  if (loading) {
    return <Loading fullScreen text="Loading tables..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tables</h1>
          <p className="text-sm text-gray-600 mt-1">Manage restaurant tables</p>
        </div>
        <Button variant="primary" onClick={handleCreate} className="gap-2">
          <HiPlus className="h-5 w-5" />
          Add Table
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600 mb-1">Total Tables</p>
          <p className="text-2xl font-bold text-gray-900">{tables.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 mb-1">Available</p>
          <p className="text-2xl font-bold text-success-600">
            {tables.filter((t) => t.status === 'available').length}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 mb-1">Occupied</p>
          <p className="text-2xl font-bold text-danger-600">
            {tables.filter((t) => t.status === 'occupied').length}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 mb-1">Reserved</p>
          <p className="text-2xl font-bold text-warning-600">
            {tables.filter((t) => t.status === 'reserved').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location Filter */}
          <div className="relative">
            <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="form-input pl-10"
            >
              <option value="all">All Locations</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input pl-10"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredTables.map((table) => (
          <div
            key={table.id}
            className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${getTableColor(
              table.status
            )}`}
            onClick={() => handleEdit(table)}
          >
            {/* Table Number */}
            <div className="text-center mb-3">
              <p className="text-2xl font-bold text-gray-900">{table.table_number}</p>
              <Badge variant={getStatusColor(table.status)} size="sm" className="mt-2">
                {table.status}
              </Badge>
            </div>

            {/* Details */}
            <div className="space-y-1 text-xs text-gray-600 text-center">
              <p className="capitalize">📍 {table.location}</p>
              <p>👥 {table.capacity} seats</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(table);
                }}
                className="flex-1"
              >
                <HiPencil className="h-3 w-3" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirm(table);
                }}
                className="flex-1"
              >
                <HiTrash className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTables.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <HiFilter className="h-full w-full" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No tables found</h3>
            <p className="text-sm text-gray-500">
              {filterLocation !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating a new table'}
            </p>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTable(null);
        }}
        title={selectedTable ? 'Edit Table' : 'Create Table'}
        size="md"
      >
        <TableForm
          table={selectedTable}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedTable(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Table"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete table <strong>{deleteConfirm?.table_number}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm.id)}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TableList;