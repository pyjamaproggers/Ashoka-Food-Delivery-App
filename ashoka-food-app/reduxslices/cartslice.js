import { createSlice } from "@reduxjs/toolkit";
import React from "react";

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        updateCartAdd: (state, action) => {
            const stateUpdated = state.items.map((item) => {
                if (item.name === action.payload.dishName) {
                    return {
                        ...item,
                        quantity: ++item.quantity,
                    };
                } else {
                    return item;
                }
            });
            state.items=[...stateUpdated]
        },
        updateCartRemove: (state, action) => {
            const stateUpdated = state.items.map((item) => {
                if (item.name === action.payload.dishName) {
                    return {
                        ...item,
                        quantity: --item.quantity,
                    };
                } else {
                    return item;
                }
            });
            console.log(stateUpdated)
            state.items=[...stateUpdated]
        },
        addToCart: (state, action) => {
            state.items = [...state.items, action.payload];
        },
        removeFromCart: (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id)
            let newCart = [...state.items]
            if (index >= 0) {
                newCart.splice(index, 1)
            } else {
                console.warn(
                    `Can't remove product (id: ${action.payload.id}) as it is not in basket`
                )
            }
            state.items = newCart
        }
    }
})

export const { addToCart, removeFromCart, updateCartAdd, updateCartRemove } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartItemsWithId = (state, id) =>
    state.cart.items.filter(item => item.id === id)

export const selectCartTotal = state =>
    state.cart.items.reduce((total, item) => (total += item.Price), 0)

export default cartSlice.reducer;