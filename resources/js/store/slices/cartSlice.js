import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    orderType: "dine_in",
    table_id: null,
    customer_name: "",
    notes: "",
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
};

const calculateTotals = (items) => {
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const tax = subtotal * 0.1; // 10% tax
    const discount = 0;
    const total = subtotal + tax - discount;

    return { subtotal, tax, discount, total };
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.items.find((i) => i.id === item.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...item, quantity: 1 });
            }

            const totals = calculateTotals(state.items);
            Object.assign(state, totals);
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload,
            );
            const totals = calculateTotals(state.items);
            Object.assign(state, totals);
        },

        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find((i) => i.id === id);

            if (item) {
                item.quantity = quantity;
            }

            const totals = calculateTotals(state.items);
            Object.assign(state, totals);
        },

        clearCart: (state) => {
            return initialState;
        },

        setOrderType: (state, action) => {
            state.orderType = action.payload;
            if (action.payload !== "dine_in") {
                state.table_id = null;
                state.customer_name = "";
            }
        },

        setCustomerInfo: (state, action) => {
            const { table_id, customer_name } = action.payload;
            if (table_id !== undefined) state.table_id = table_id;
            if (customer_name !== undefined)
                state.customer_name = customer_name;
        },

        setNotes: (state, action) => {
            state.notes = action.payload;
        },

        setDiscount: (state, action) => {
            state.discount = action.payload;
            state.total = state.subtotal + state.tax - state.discount;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setOrderType,
    setCustomerInfo,
    setNotes,
    setDiscount,
} = cartSlice.actions;

export default cartSlice.reducer;
