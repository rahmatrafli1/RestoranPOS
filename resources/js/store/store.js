import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import menuReducer from './slices/menuSlice';
import tableReducer from './slices/tableSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice'; // 👈 BARU

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    categories: categoryReducer,
    menu: menuReducer,
    tables: tableReducer,
    orders: orderReducer,
    users: userReducer, // 👈 BARU
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;