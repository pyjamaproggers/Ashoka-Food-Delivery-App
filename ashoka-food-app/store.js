import { configureStore } from '@reduxjs/toolkit'
import cartReducer from "./reduxslices/cartslice"
export const store = configureStore({
  reducer: {
    cart: cartReducer
  },
})