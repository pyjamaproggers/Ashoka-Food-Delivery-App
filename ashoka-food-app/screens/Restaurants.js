import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import RestaurantCards from '../components/RestaurantCards'
import THC from '../assets/THC.jpg'
import SubwayIcon from '../assets/subwayicon.png'
import ChicagoPizzaIcon from '../assets/chicagopizzaicon.jpg'
import Dosai from '../assets/dosai.jpg'
import Dhaba from '../assets/dhaba.png'
import Grey from '../assets/greysquare.jpeg'

const Restaurants = () => {

    const DRestaurants = [
        {
            id:7,
            title:"Roti Boti",
            image: Grey,
            timing: "6am To 12am",
            genre: "North Indian & Chinese",
            description: "Best Mix Of North Indian & Chinese",
            location: "Opposite Tennis Court"
        },
        {
            id:1,
            title:"The Hunger Cycle",
            image: THC,
            timing: "6am To 12am",
            genre: "Fast Food",
            description: "EPIC MUNCHIES 24 X 7",
            location: "Mess - G Floor"
        },
        {
            id:2,
            title:"Chicago Pizza",
            image: ChicagoPizzaIcon,
            timing: "6am To 12am",
            genre: "Fast Food",
            description: "Big Slices, Really Fast",
            location: "Next To Mess"
        },
        {
            id:3,
            title:"Subway",
            image: SubwayIcon,
            timing: "6am To 12am",
            genre: "Fast Food",
            description: "Eat Fresh",
            location: "Mess - 1st Floor"
        },
        {
            id:4,
            title:"Dhaba",
            image: Dhaba,
            timing: "6am To 12am",
            genre: "Indian",
            description: "Classic Indian Dhaba",
            location: "Next To Frisbee Field"
        },
        {
          id:5,
          title:"Chaat Stall",
          image: Grey,
          timing: "6am To 12am",
          genre: "Chaat",
          description: "From Gol Gappe To Rolls!",
          location: "Next To Tennis Court"
      },
      {
        id:6,
        title:"Rasananda",
        image: Grey,
        timing: "6am To 12am",
        genre: "Snacks",
        description: "Late Night Snacks Joint",
        location: "Next To Tennis Court"
      },
    ]

    const NDRestaurants = [
    {
      id:7,
      title:"Dosai",
      image: Dosai,
      timing: "6am To 12am",
      genre: "South Indian",
      description: "Authentic South Indian Dosa Joint",
      location: "Next To Frisbee Field"
    },
    {
      id:8,
      title:"Chai Shai",
      image: Grey,
      timing: "6am To 12am",
      genre: "Breakfast",
      description: "Bread, Eggs & Cakes!",
      location: "Mess Ground Floor"
    },
    {
      id:9,
      title:"Fuelzone",
      image: Grey,
      timing: "6am To 12am",
      genre: "Fast Food",
      description: "Coffee, Shakes, Snadwiches & More!",
      location: "Mess Ground Floor"
    },
    {
      id:10,
      title:"Nescafe",
      image: Grey,
      timing: "6am To 12am",
      genre: "Coffee & Snacks",
      description: "From Coffee To Maggi To Sandwiches!",
      location: "Next To AC02"
    },
    {
      id:11,
      title:"Amul",
      image: Grey,
      timing: "6am To 12am",
      genre: "Dairy",
      description: "From Ice Cream To Waffles & More!",
      location: "Next To AC02"
    },
    ]

  return (
    <ScrollView >
      <View className=' w-11/12 h-48 self-center mt-4 mb-2 rounded-full shadow-md'>
        <Image source={Grey} style={{width: '100%', height: '100%', borderRadius: 15,}} />
      </View>

      <View className='mt-5 border-t border-gray-300' >
        <Text className="text-center font-normal text-xs text-gray-400 mx-28 mt-3 -top-5 bg-white">
          WHAT'S ON YOUR MIND?
        </Text>
      </View>

      {/* <RestaurantCards name="The Hunger Cycle" image={THC}/>
      <RestaurantCards name="Chicago Pizza" image={ChicagoPizzaIcon}/>
      <RestaurantCards name="Subway" image={SubwayIcon}/>
      <RestaurantCards name="Dosai" image={Dosai}/>
      <RestaurantCards name="Dhaba" image={Dhaba}/> */}
      
      {
        DRestaurants.map((restaurant)=>
        (
            <RestaurantCards 
            id={restaurant.id}
            image={restaurant.image}
            title={restaurant.title}
            timing={restaurant.timing}
            genre={restaurant.genre}
            location={restaurant.location}
            description={restaurant.description}/>
        ))
      }

      <View className=' w-11/12 h-48 self-center mt-4 mb-2 rounded-full shadow-md'>
        <Image source={Grey} style={{width: '100%', height: '100%', borderRadius: 15,}} />
      </View>
      
      <View className='mt-5 border-t border-gray-300' >
        <Text className="text-center font-normal text-xs text-gray-400 mx-24 mt-3 -top-5 bg-white">
          TAKE A LOOK AT THESE MENUS
        </Text>
      </View>

      {
        NDRestaurants.map((restaurant)=>
        (
            <RestaurantCards 
            id={restaurant.id}
            image={restaurant.image}
            title={restaurant.title}
            timing={restaurant.timing}
            genre={restaurant.genre}
            location={restaurant.location}
            description={restaurant.description}/>
        ))
      }
    </ScrollView>
  )
}

export default Restaurants