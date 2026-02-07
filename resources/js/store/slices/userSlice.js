import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

// Async Thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await userService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await userService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await userService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      await userService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateStatus',
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await userService.updateStatus(id, isActive);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

export const fetchUserStatistics = createAsyncThunk(
  'users/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getStatistics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

// Initial State
const initialState = {
  items: [],
  selectedUser: null,
  statistics: {
    total: 0,
    active: 0,
    inactive: 0,
    byRole: {},
  },
  loading: false,
  error: null,
  filters: {
    search: '',
    role: null,
    is_active: null,
  },
  pagination: {
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  },
};

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch User By ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create User
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update User
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete User
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update User Status
    builder
      .addCase(updateUserStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Fetch Statistics
    builder
      .addCase(fetchUserStatistics.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
        state.error = null;
      })
      .addCase(fetchUserStatistics.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Actions
export const {
  setSelectedUser,
  clearSelectedUser,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
} = userSlice.actions;

// Selectors
export const selectAllUsers = (state) => state.users.items;
export const selectSelectedUser = (state) => state.users.selectedUser;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersFilters = (state) => state.users.filters;
export const selectUsersPagination = (state) => state.users.pagination;
export const selectUsersStatistics = (state) => state.users.statistics;

export const selectActiveUsers = (state) =>
  state.users.items.filter((user) => user.is_active);

export const selectUsersByRole = (role) => (state) =>
  state.users.items.filter((user) => user.role === role);

export const selectFilteredUsers = (state) => {
  const { items, filters } = state.users;
  let filtered = [...items];

  // Filter by search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.username.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower)
    );
  }

  // Filter by role
  if (filters.role) {
    filtered = filtered.filter((item) => item.role === filters.role);
  }

  // Filter by is_active
  if (filters.is_active !== null) {
    filtered = filtered.filter((item) => item.is_active === filters.is_active);
  }

  return filtered;
};

export default userSlice.reducer;