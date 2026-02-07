import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import tableService from '../../services/tableService';
import toast from 'react-hot-toast';

const schema = yup.object({
  table_number: yup.string().required('Table number is required'),
  capacity: yup.number().required('Capacity is required').min(1, 'Capacity must be at least 1'),
  location: yup.string().required('Location is required'),
  status: yup.string().required('Status is required'),
}).required();

const TableForm = ({ table, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      table_number: '',
      capacity: 4,
      location: 'indoor',
      status: 'available',
    },
  });

  useEffect(() => {
    if (table) {
      reset({
        table_number: table.table_number || '',
        capacity: table.capacity || 4,
        location: table.location || 'indoor',
        status: table.status || 'available',
      });
    }
  }, [table, reset]);

  const onSubmit = async (data) => {
    try {
      if (table) {
        await tableService.update(table.id, data);
        toast.success('Table updated successfully');
      } else {
        await tableService.create(data);
        toast.success('Table created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save table');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Table Number */}
      <div>
        <Input
          label="Table Number"
          {...register('table_number')}
          error={errors.table_number?.message}
          placeholder="e.g., T-01, A1"
          required
        />
      </div>

      {/* Capacity */}
      <div>
        <Input
          label="Capacity"
          type="number"
          {...register('capacity')}
          error={errors.capacity?.message}
          placeholder="4"
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="form-label">
          Location <span className="text-danger-500">*</span>
        </label>
        <select {...register('location')} className="form-input">
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
          <option value="vip">VIP</option>
        </select>
        {errors.location && <p className="form-error">{errors.location.message}</p>}
      </div>

      {/* Status */}
      <div>
        <label className="form-label">
          Status <span className="text-danger-500">*</span>
        </label>
        <select {...register('status')} className="form-input">
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="reserved">Reserved</option>
          <option value="maintenance">Maintenance</option>
        </select>
        {errors.status && <p className="form-error">{errors.status.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} fullWidth>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting} fullWidth>
          {table ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default TableForm;