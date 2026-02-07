import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tableService from '../../services/tableService';

// Async Thunks
export const fetchTables = createAsyncThunk(
  'tables/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tableService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tables');
    }
  }
);

export const createTable = createAsyncThunk(
  'tables/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await tableService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create table');
    }
  }
);

export const updateTable = createAsyncThunk(
  'tables/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await tableService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update table');
    }
  }
);

export const updateTableStatus = createAsyncThunk(
  'tables/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await tableService.updateStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update table status');
    }
  }
);

export const deleteTable = createAsyncThunk(
  'tables/delete',
  async (id, { rejectWithValue }) => {
    try {
      await tableService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete table');
    }
  }
);

// Initial State
const initialState = {
  items: [],
  selectedTable: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: null,
    location: null,
  },
  stats: {
    total: 0,
    available: 0,
    occupied: 0,
    reserved: 0,
  },
};

// Slice
const tableSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setSelectedTable: (state, action) => {
      state.selectedTable = action.payload;
    },
    clearSelectedTable: (state) => {
      state.selectedTable = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    updateStats: (state) => {
      state.stats.total = state.items.length;
      state.stats.available = state.items.filter((t) => t.status === 'available').length;
      state.stats.occupied = state.items.filter((t) => t.status === 'occupied').length;
      state.stats.reserved = state.items.filter((t) => t.status === 'reserved').length;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tables
    builder
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        tableSlice.caseReducers.updateStats(state);
        state.error = null;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Table
    builder
      .addCase(createTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTable.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        tableSlice.caseReducers.updateStats(state);
        state.error = null;
      })
      .addCase(createTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Table
    builder
      .addCase(updateTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTable.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedTable?.id === action.payload.id) {
          state.selectedTable = action.payload;
        }
        tableSlice.caseReducers.updateStats(state);
        state.error = null;
      })
      .addCase(updateTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Table Status
    builder
      .addCase(updateTableStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTableStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedTable?.id === action.payload.id) {
          state.selectedTable = action.payload;
        }
        tableSlice.caseReducers.updateStats(state);
        state.error = null;
      })
      .addCase(updateTableStatus.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Delete Table
    builder
      .addCase(deleteTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedTable?.id === action.payload) {
          state.selectedTable = null;
        }
        tableSlice.caseReducers.updateStats(state);
        state.error = null;
      })
      .addCase(deleteTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const {
  setSelectedTable,
  clearSelectedTable,
  setFilters,
  clearFilters,
  updateStats,
  clearError,
} = tableSlice.actions;

// Selectors
export const selectAllTables = (state) => state.tables.items;
export const selectSelectedTable = (state) => state.tables.selectedTable;
export const selectTablesLoading = (state) => state.tables.loading;
export const selectTablesError = (state) => state.tables.error;
export const selectTablesFilters = (state) => state.tables.filters;
export const selectTablesStats = (state) => state.tables.stats;

export const selectAvailableTables = (state) =>
  state.tables.items.filter((table) => table.status === 'available');

export const selectTablesByLocation = (location) => (state) =>
  state.tables.items.filter((table) => table.location === location);

export const selectFilteredTables = (state) => {
  const { items, filters } = state.tables;
  let filtered = [...items];

  // Filter by search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter((item) =>
      item.table_number.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter((item) => item.status === filters.status);
  }

  // Filter by location
  if (filters.location) {
    filtered = filtered.filter((item) => item.location === filters.location);
  }

  // Sort by table_number
  filtered.sort((a, b) => {
    const aNum = parseInt(a.table_number.replace(/\D/g, '')) || 0;
    const bNum = parseInt(b.table_number.replace(/\D/g, '')) || 0;
    return aNum - bNum;
  });

  return filtered;
};

export default tableSlice.reducer;