import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import menuService from '../../services/menuService';

// Async Thunks
export const fetchMenuItems = createAsyncThunk(
  'menu/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await menuService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch menu items');
    }
  }
);

export const fetchMenuItemById = createAsyncThunk(
  'menu/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await menuService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch menu item');
    }
  }
);

export const createMenuItem = createAsyncThunk(
  'menu/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await menuService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create menu item');
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'menu/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await menuService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update menu item');
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'menu/delete',
  async (id, { rejectWithValue }) => {
    try {
      await menuService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete menu item');
    }
  }
);

// Initial State
const initialState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    category_id: null,
    is_available: null,
  },
  sort: {
    field: 'name',
    direction: 'asc',
  },
};

// Slice
const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Menu Items
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Menu Item By ID
    builder
      .addCase(fetchMenuItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
        state.error = null;
      })
      .addCase(fetchMenuItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Menu Item
    builder
      .addCase(createMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Menu Item
    builder
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedItem?.id === action.payload.id) {
          state.selectedItem = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Menu Item
    builder
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedItem?.id === action.payload) {
          state.selectedItem = null;
        }
        state.error = null;
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const {
  setSelectedItem,
  clearSelectedItem,
  setFilters,
  clearFilters,
  setSort,
  clearError,
} = menuSlice.actions;

// Selectors
export const selectAllMenuItems = (state) => state.menu.items;
export const selectSelectedMenuItem = (state) => state.menu.selectedItem;
export const selectMenuLoading = (state) => state.menu.loading;
export const selectMenuError = (state) => state.menu.error;
export const selectMenuFilters = (state) => state.menu.filters;
export const selectMenuSort = (state) => state.menu.sort;

export const selectAvailableMenuItems = (state) =>
  state.menu.items.filter((item) => item.is_available);

export const selectMenuItemsByCategory = (categoryId) => (state) =>
  state.menu.items.filter((item) => item.category_id === categoryId && item.is_available);

export const selectFilteredMenuItems = (state) => {
  const { items, filters, sort } = state.menu;
  let filtered = [...items];

  // Filter by search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
    );
  }

  // Filter by category
  if (filters.category_id) {
    filtered = filtered.filter((item) => item.category_id === parseInt(filters.category_id));
  }

  // Filter by availability
  if (filters.is_available !== null) {
    filtered = filtered.filter((item) => item.is_available === filters.is_available);
  }

  // Sort
  filtered.sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    if (sort.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
};

export default menuSlice.reducer;