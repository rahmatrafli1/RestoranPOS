import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isCashier = () => {
    return user && user.role === 'cashier';
  };

  const isWaiter = () => {
    return user && user.role === 'waiter';
  };

  const isChef = () => {
    return user && user.role === 'chef';
  };

  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout,
    isAdmin,
    isCashier,
    isWaiter,
    isChef,
    hasRole,
  };
};