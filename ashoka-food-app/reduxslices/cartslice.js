import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      state.items = [...state.items, action.payload]
    },
    removeFromCart: (state) => {
      state.value -= 1
    },
  },
})

export const { addToCart, removeFromCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items;

export default cartSlice.reducer