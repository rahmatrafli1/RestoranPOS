// filepath: resources/js/store/slices/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  orderType: 'dine_in',
  tableId: null,
  customerName: '',
  notes: '',
  discount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.menu_item_id === action.payload.menu_item_id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
      } else {
        state.items.push({
          ...action.payload,
          subtotal: action.payload.quantity * action.payload.price,
        });
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.menu_item_id !== action.payload
      );
    },

    updateQuantity: (state, action) => {
      const { menu_item_id, quantity } = action.payload;
      const item = state.items.find((item) => item.menu_item_id === menu_item_id);
      
      if (item) {
        item.quantity = quantity;
        item.subtotal = item.quantity * item.price;
      }
    },

    updateItemNotes: (state, action) => {
      const { menu_item_id, notes } = action.payload;
      const item = state.items.find((item) => item.menu_item_id === menu_item_id);
      
      if (item) {
        item.notes = notes;
      }
    },

    setOrderType: (state, action) => {
      state.orderType = action.payload;
      if (action.payload !== 'dine_in') {
        state.tableId = null;
      }
    },

    setTableId: (state, action) => {
      state.tableId = action.payload;
    },

    setCustomerName: (state, action) => {
      state.customerName = action.payload;
    },

    setNotes: (state, action) => {
      state.notes = action.payload;
    },

    setDiscount: (state, action) => {
      state.discount = action.payload;
    },

    clearCart: (state) => {
      return initialState;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  updateItemNotes,
  setOrderType,
  setTableId,
  setCustomerName,
  setNotes,
  setDiscount,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((total, item) => total + parseFloat(item.subtotal), 0);
export const selectCartTax = (state) => {
  const subtotal = selectCartSubtotal(state);
  return subtotal * 0.1;
};
export const selectCartTotal = (state) => {
  const subtotal = selectCartSubtotal(state);
  const tax = selectCartTax(state);
  return subtotal + tax - state.cart.discount;
};