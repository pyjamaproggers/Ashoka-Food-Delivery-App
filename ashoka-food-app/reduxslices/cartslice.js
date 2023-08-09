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
                if (item.name === action.payload.dishName && item.Restaurant === action.payload.restaurant) {
                    return {
                        ...item,
                        quantity: ++item.quantity,
                    };
                } else {
                    return item;
                }
            });
            state.items = [...stateUpdated]
        },
        updateCartAddCustomized: (state, action) => {
            const stateUpdated = state.items.map((item) => {
                if (item.name === action.payload.dishName && objectsAreEqual(item.customizations, action.payload.customizations)) {
                    return {
                        ...item,
                        quantity: action.payload.newQuantity,
                    };
                } else {
                    return item;
                }
            });
            state.items = [...stateUpdated]
        },
        updateCartRemove: (state, action) => {
            const stateUpdated = state.items.map((item) => {
                if (item.name === action.payload.dishName && item.Restaurant === action.payload.restaurant) {
                    return {
                        ...item,
                        quantity: --item.quantity,
                    };
                } else {
                    return item;
                }
            });
            state.items = [...stateUpdated]
        },
        updateCartRemoveCustomized: (state, action) => {
            console.log(action.payload)
            const stateUpdated = state.items.map((item) => {
                console.log('state item: ' + item)
                if ((item.name === action.payload.dishName)) {
                    if (item.customizations && objectsAreEqual(item.customizations, action.payload.customizations) == false) {
                        if (item !== undefined) {
                            return item
                        }
                    }
                }
                else {
                    if (item !== undefined) {
                        return item
                    }
                }
            });
            let finalState = stateUpdated.filter(e=>e!==undefined)
            if (finalState) {
                state.items = [...finalState]
            }
            else {
                state.items = []
            }
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

function objectsAreEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}

export const { addToCart, removeFromCart, updateCartAdd, updateCartRemove, updateCartAddCustomized, updateCartRemoveCustomized } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartItemsWithId = (state, id) =>
    state.cart.items.filter(item => item.id === id)

export const selectCartTotal = state =>
    state.cart.items.reduce((total, item) => (total += item.Price), 0)

export default cartSlice.reducer;