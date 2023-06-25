import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  restaurant: {
    description: null, location : null,
        name : null, image : null, genre : null, timing : null, 
        dishes : null
  }
}

export const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurant: (state, action) => {
      state.restaurant = action.payload
      console.log("action.payload")
    }
  }
})

export const { setRestaurant } = restaurantSlice.actions

export const selectRestaurant = state => state.restaurant.restaurant

export default restaurantSlice.reducer