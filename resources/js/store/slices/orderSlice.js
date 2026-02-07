import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

// Async Thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await orderService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.cancel(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

export const fetchKitchenOrders = createAsyncThunk(
  'orders/fetchKitchen',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getKitchenOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch kitchen orders');
    }
  }
);

// Initial State
const initialState = {
  items: [],
  kitchenOrders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: null,
    order_type: null,
    date: null,
  },
  stats: {
    total: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
  },
};

// Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    updateStats: (state) => {
      state.stats.total = state.items.length;
      state.stats.pending = state.items.filter((o) => o.status === 'pending').length;
      state.stats.preparing = state.items.filter((o) => o.status === 'preparing').length;
      state.stats.ready = state.items.filter((o) => o.status === 'ready').length;
      state.stats.completed = state.items.filter((o) => o.status === 'completed').length;
      state.stats.cancelled = state.items.filter((o) => o.status === 'cancelled').length;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        orderSlice.caseReducers.updateStats(state);
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Order By ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        orderSlice.caseReducers.updateStats(state);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        const kitchenIndex = state.kitchenOrders.findIndex((item) => item.id === action.payload.id);
        if (kitchenIndex !== -1) {
          state.kitchenOrders[kitchenIndex] = action.payload;
        }

        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
        orderSlice.caseReducers.updateStats(state);
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Cancel Order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
        orderSlice.caseReducers.updateStats(state);
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Kitchen Orders
    builder
      .addCase(fetchKitchenOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKitchenOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.kitchenOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchKitchenOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const {
  setSelectedOrder,
  clearSelectedOrder,
  setFilters,
  clearFilters,
  updateStats,
  clearError,
} = orderSlice.actions;

// Selectors
export const selectAllOrders = (state) => state.orders.items;
export const selectKitchenOrders = (state) => state.orders.kitchenOrders;
export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersFilters = (state) => state.orders.filters;
export const selectOrdersStats = (state) => state.orders.stats;

export const selectOrdersByStatus = (status) => (state) =>
  state.orders.items.filter((order) => order.status === status);

export const selectPendingOrders = (state) =>
  state.orders.items.filter((order) => order.status === 'pending');

export const selectActiveOrders = (state) =>
  state.orders.items.filter(
    (order) => 
      order.status === 'pending' || 
      order.status === 'preparing' || 
      order.status === 'ready'
  );

export const selectFilteredOrders = (state) => {
  const { items, filters } = state.orders;
  let filtered = [...items];

  // Filter by search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.order_number.toLowerCase().includes(searchLower) ||
        item.customer_name?.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter((item) => item.status === filters.status);
  }

  // Filter by order_type
  if (filters.order_type) {
    filtered = filtered.filter((item) => item.order_type === filters.order_type);
  }

  // Filter by date
  if (filters.date) {
    filtered = filtered.filter((item) => {
      const orderDate = new Date(item.created_at).toISOString().split('T')[0];
      return orderDate === filters.date;
    });
  }

  // Sort by created_at descending
  filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return filtered;
};

export default orderSlice.reducer;