import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  orderType: 'dine_in',
  table_id: null,
  customer_name: '',
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
};

const calculateTotals = (items, discount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax - discount;

  return { subtotal, tax, total };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1, notes: '' });
      }

      const totals = calculateTotals(state.items, state.discount);
      state.subtotal = totals.subtotal;
      state.tax = totals.tax;
      state.total = totals.total;
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      const totals = calculateTotals(state.items, state.discount);
      state.subtotal = totals.subtotal;
      state.tax = totals.tax;
      state.total = totals.total;
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.quantity = quantity;
      }

      const totals = calculateTotals(state.items, state.discount);
      state.subtotal = totals.subtotal;
      state.tax = totals.tax;
      state.total = totals.total;
    },

    updateItemNotes: (state, action) => {
      const { id, notes } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.notes = notes;
      }
    },

    setDiscount: (state, action) => {
      state.discount = action.payload;

      const totals = calculateTotals(state.items, state.discount);
      state.subtotal = totals.subtotal;
      state.tax = totals.tax;
      state.total = totals.total;
    },

    setOrderType: (state, action) => {
      state.orderType = action.payload;
      
      // Clear table selection if not dine-in
      if (action.payload !== 'dine_in') {
        state.table_id = null;
      }
    },

    setCustomerInfo: (state, action) => {
      const { table_id, customer_name } = action.payload;
      if (table_id !== undefined) state.table_id = table_id;
      if (customer_name !== undefined) state.customer_name = customer_name;
    },

    clearCart: (state) => {
      return initialState;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateItemNotes,
  setDiscount,
  setOrderType,
  setCustomerInfo,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;