import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "./contexts/NotificationContext";
import AppRouter from "./router";
import { fetchUser, setLoading } from "./store/slices/authSlice";

// Component untuk handle auth initialization
const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                // Fetch user data jika ada token
                await dispatch(fetchUser());
            } else {
                // Set loading false jika tidak ada token
                dispatch(setLoading(false));
            }
        };

        initAuth();
    }, [dispatch]);

    // Tampilkan loading saat checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return children;
};

function MainApp() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AuthInitializer>
                    <NotificationProvider>
                        <Toaster position="top-right" />
                        <AppRouter />
                    </NotificationProvider>
                </AuthInitializer>
            </BrowserRouter>
        </Provider>
    );
}

export default MainApp;
