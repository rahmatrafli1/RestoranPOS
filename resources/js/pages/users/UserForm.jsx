import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('Name is required').max(100),
  username: yup.string().required('Username is required').max(50),
  email: yup.string().email('Invalid email').nullable(),
  password: yup.string().when('$isEdit', {
    is: false,
    then: (schema) => schema.required('Password is required').min(6, 'Password must be at least 6 characters'),
    otherwise: (schema) => schema.nullable(),
  }),
  password_confirmation: yup.string().when('password', {
    is: (value) => value && value.length > 0,
    then: (schema) => schema.oneOf([yup.ref('password')], 'Passwords must match'),
    otherwise: (schema) => schema.nullable(),
  }),
  role: yup.string().required('Role is required'),
  is_active: yup.boolean(),
}).required();

const UserForm = ({ user, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    context: { isEdit: !!user },
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'cashier',
      is_active: true,
    },
  });

  const password = watch('password');

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'cashier',
        is_active: user.is_active !== undefined ? user.is_active : true,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        username: data.username,
        email: data.email || null,
        role: data.role,
        is_active: data.is_active,
      };

      // Only include password if provided
      if (data.password) {
        payload.password = data.password;
        payload.password_confirmation = data.password_confirmation;
      }

      if (user) {
        await userService.update(user.id, payload);
        toast.success('User updated successfully');
      } else {
        await userService.create(payload);
        toast.success('User created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save user');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <Input
          label="Full Name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="John Doe"
          required
        />
      </div>

      {/* Username */}
      <div>
        <Input
          label="Username"
          {...register('username')}
          error={errors.username?.message}
          placeholder="johndoe"
          required
        />
      </div>

      {/* Email */}
      <div>
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="john@example.com"
        />
      </div>

      {/* Role */}
      <div>
        <label className="form-label">
          Role <span className="text-danger-500">*</span>
        </label>
        <select {...register('role')} className="form-input">
          <option value="admin">Admin</option>
          <option value="cashier">Cashier</option>
          <option value="waiter">Waiter</option>
          <option value="chef">Chef</option>
        </select>
        {errors.role && <p className="form-error">{errors.role.message}</p>}
      </div>

      {/* Password */}
      <div>
        <Input
          label={user ? 'New Password (leave blank to keep current)' : 'Password'}
          type="password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="••••••••"
          required={!user}
        />
      </div>

      {/* Password Confirmation */}
      {password && (
        <div>
          <Input
            label="Confirm Password"
            type="password"
            {...register('password_confirmation')}
            error={errors.password_confirmation?.message}
            placeholder="••••••••"
            required
          />
        </div>
      )}

      {/* Is Active */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_active"
          {...register('is_active')}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Active User
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} fullWidth>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting} fullWidth>
          {user ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;