// filepath: resources/js/store/slices/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const initialState = {
    user: authService.getStoredUser(),
    token: authService.getStoredToken(),
    isAuthenticated: authService.isAuthenticated(),
    loading: false,
    error: null,
};

// Async thunks
export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed",
            );
        }
    },
);

export const logout = createAsyncThunk("auth/logout", async () => {
    try {
        await authService.logout();
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        authService.clearStorage();
    }
});

export const fetchUser = createAsyncThunk(
    "auth/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const user = await authService.me();
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        } catch (error) {
            authService.clearStorage();
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch user",
            );
        }
    },
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload));
            }
        },
        clearError: (state) => {
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            })
            // Fetch User
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setUser, clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
