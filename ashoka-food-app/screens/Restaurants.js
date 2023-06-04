import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import RestaurantCards from '../components/RestaurantCards'
import THC from '../assets/THC.jpg'
import SubwayIcon from '../assets/subwayicon.png'
import ChicagoPizzaIcon from '../assets/chicagopizzaicon.jpg'
import Dosai from '../assets/dosai.jpg'
import Dhaba from '../assets/dhaba.png'

const Restaurants = () => {

    const Restaurants = [
        {
            id:1,
            title:"The Hunger Cycle",
            image: THC,
            rating: "5/5",
            genre: "Fast Food",
            description: "EPIC MUNCHIES 24 X 7",
            location: "Ground Floor Mess"
        },
        {
            id:2,
            title:"Chicago Pizza",
            image: ChicagoPizzaIcon,
            rating: "5/5",
            genre: "Fast Food",
            description: "Big Slices, Really Fast",
            location: "Outside Mess"
        },
        {
            id:3,
            title:"Subway",
            image: SubwayIcon,
            rating: "5/5",
            genre: "Fast Food",
            description: "Eat Fresh",
            location: "First Floor Mess"
        },
        {
            id:4,
            title:"Dhaba",
            image: Dhaba,
            rating: "5/5",
            genre: "Indian",
            description: "Dhaba",
            location: "Near Tennis Court"
        },
        {
            id:5,
            title:"Dosai",
            image: Dosai,
            rating: "5/5",
            genre: "South Indian",
            description: "Authentic South Indian Dosa joint",
            location: "Near Tennis Court"
        },
    ]



  return (
    <ScrollView>
      <Text className="font-bold text-2xl text-black p-2 pb-3 px-2">Restaurants</Text>
      {/* <RestaurantCards name="The Hunger Cycle" image={THC}/>
      <RestaurantCards name="Chicago Pizza" image={ChicagoPizzaIcon}/>
      <RestaurantCards name="Subway" image={SubwayIcon}/>
      <RestaurantCards name="Dosai" image={Dosai}/>
      <RestaurantCards name="Dhaba" image={Dhaba}/> */}
      {
        Restaurants.map((restaurant)=>
        (
            <RestaurantCards 
            id={restaurant.id}
            image={restaurant.image}
            title={restaurant.title}
            rating={restaurant.rating}
            genre={restaurant.genre}
            location={restaurant.location}
            description={restaurant.description}/>
        ))
      }
    </ScrollView>
  )
}

export default Restaurants