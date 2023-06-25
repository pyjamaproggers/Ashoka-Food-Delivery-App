import { configureStore } from '@reduxjs/toolkit'
import cartReducer from "./reduxslices/cartslice"
import restaurantReducer from "./reduxslices/restaurantSlice"
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    restaurant: restaurantReducer,
  },
})