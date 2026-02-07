import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import menuService from '../../services/menuService';
import { getImageUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { HiUpload } from 'react-icons/hi';

const schema = yup.object({
  name: yup.string().required('Name is required').max(100),
  description: yup.string().nullable(),
  price: yup.number().required('Price is required').min(0, 'Price must be positive'),
  category_id: yup.number().required('Category is required'),
  is_available: yup.boolean(),
}).required();

const MenuForm = ({ menuItem, categories, onSuccess, onCancel }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category_id: '',
      is_available: true,
    },
  });

  useEffect(() => {
    if (menuItem) {
      reset({
        name: menuItem.name || '',
        description: menuItem.description || '',
        price: menuItem.price || 0,
        category_id: menuItem.category_id || '',
        is_available: menuItem.is_available !== undefined ? menuItem.is_available : true,
      });
      if (menuItem.image) {
        setImagePreview(getImageUrl(menuItem.image));
      }
    }
  }, [menuItem, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('price', data.price);
      formData.append('category_id', data.category_id);
      formData.append('is_available', data.is_available ? 1 : 0);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (menuItem) {
        formData.append('_method', 'PUT');
        await menuService.update(menuItem.id, formData);
        toast.success('Menu item updated successfully');
      } else {
        await menuService.create(formData);
        toast.success('Menu item created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save menu item');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Image Upload */}
      <div>
        <label className="form-label">Image</label>
        <div className="mt-1 flex items-center gap-4">
          {/* Preview */}
          <div className="flex-shrink-0 h-32 w-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                <HiUpload className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex-1">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="image"
              className="btn btn-outline cursor-pointer inline-flex items-center gap-2"
            >
              <HiUpload className="h-5 w-5" />
              Choose Image
            </label>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <Input
          label="Name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="e.g., Nasi Goreng"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="form-label">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="form-input"
          placeholder="Enter item description (optional)"
        />
        {errors.description && (
          <p className="form-error">{errors.description.message}</p>
        )}
      </div>

      {/* Price & Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Price"
            type="number"
            step="0.01"
            {...register('price')}
            error={errors.price?.message}
            placeholder="0"
            required
          />
        </div>

        <div>
          <label className="form-label">
            Category <span className="text-danger-500">*</span>
          </label>
          <select
            {...register('category_id')}
            className="form-input"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="form-error">{errors.category_id.message}</p>
          )}
        </div>
      </div>

      {/* Is Available */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_available"
          {...register('is_available')}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
          Available for order
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} fullWidth>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting} fullWidth>
          {menuItem ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default MenuForm;