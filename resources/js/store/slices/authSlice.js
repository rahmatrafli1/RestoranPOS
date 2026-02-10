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

            const token = response.data?.token;
            const user = response.data?.user || response.data?.data;

            if (!token || !user) {
                throw new Error("Invalid response from server");
            }

            // Token sudah disimpan di authService.login()
            // Tapi double check
            if (token) {
                localStorage.setItem("token", token);
            }

            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            }

            return { token, user };
        } catch (error) {
            console.error("=== Login Error ===");
            console.error("Error:", error);
            return rejectWithValue(
                error.response?.data?.message ||
                    error.message ||
                    "Login failed",
            );
        }
    },
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
        } catch (error) {
            // Still clear local storage even if API fails
            authService.clearAuth();
            return rejectWithValue(
                error.response?.data?.message || "Logout failed",
            );
        }
    },
);

export const fetchUser = createAsyncThunk(
    "auth/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.me();
            const user =
                response.data?.data || response.data?.user || response.data;
            return user;
        } catch (error) {
            console.error("=== Fetch User Error ===");
            console.error("Error:", error);
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
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            if (state.user) {
                localStorage.setItem("user", JSON.stringify(state.user));
            }
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

                // Clear localStorage
                authService.clearAuth();
            })
            .addCase(logout.rejected, (state) => {
                // Even if logout fails, clear state
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.loading = false;

                // Clear localStorage
                authService.clearAuth();
            })
            // Fetch User
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;

                // Save to localStorage
                if (action.payload) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(action.payload),
                    );
                }
            })
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;

                // Clear localStorage
                authService.clearAuth();
            });
    },
});

export const { setUser, clearError, setLoading, updateUser } =
    authSlice.actions;
export default authSlice.reducer;
