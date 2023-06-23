import { View, Text, ScrollView, Image, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import RestaurantCards from '../components/RestaurantCards'
import Grey from '../assets/greysquare.jpeg'
import client from '../sanity'
import { useLayoutEffect } from 'react'
import Styles from '../components/Styles'
const Restaurants = () => {

    // const DRestaurants = [
    //     {
    //         id:7,
    //         title:"Roti Boti",
    //         image: Grey,
    //         timing: "6am To 12am",
    //         genre: "Indian & Chinese",
    //         description: "Best Mix Of Indian & Chinese",
    //         location: "Opposite Tennis Court"
    //     },
    //     {
    //         id:1,
    //         title:"The Hunger Cycle",
    //         image: Grey,
    //         timing: "6am To 12am",
    //         genre: "Fast Food",
    //         description: "EPIC MUNCHIES 24 X 7",
    //         location: "Mess - G Floor"
    //     },
    //     {
    //         id:2,
    //         title:"Chicago Pizza",
    //         image: Grey,
    //         timing: "6am To 12am",
    //         genre: "Fast Food",
    //         description: "Big Slices, Really Fast!",
    //         location: "Next To Mess"
    //     },
    //     {
    //         id:3,
    //         title:"Subway",
    //         image: Grey,
    //         timing: "6am To 12am",
    //         genre: "Fast Food",
    //         description: "Eat Fresh",
    //         location: "Mess - 1st Floor"
    //     },
    //     {
    //         id:4,
    //         title:"Dhaba",
    //         image: Grey,
    //         timing: "6am To 12am",
    //         genre: "Indian",
    //         description: "Classic Indian Dhaba",
    //         location: "Next To Frisbee Field"
    //     },
    //     {
    //       id:5,
    //       title:"Chaat Stall",
    //       image: Grey,
    //       timing: "6am To 12am",
    //       genre: "Chaat",
    //       description: "From Gol Gappe To Rolls!",
    //       location: "Next To Tennis Court"
    //   },
    //   {
    //     id:6,
    //     title:"Rasananda",
    //     image: Grey,
    //     timing: "6am To 12am",
    //     genre: "Snacks",
    //     description: "Late Night Snacks Joint",
    //     location: "Next To Tennis Court"
    //   },
    // ]
    
    const [DRestaurants, setDRestaurants] = useState([]);

    const NDRestaurants = [
    {
      id:7,
      title:"Dosai",
      image: Grey,
      timing: "6am To 12am",
      genre: "South Indian",
      description: "Authentic South Indian Food Joint",
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
      description: "Coffee, Shakes & More!",
      location: "Mess Ground Floor"
    },
    {
      id:10,
      title:"Nescafe",
      image: Grey,
      timing: "6am To 12am",
      genre: "Coffee & Snacks",
      description: "Classic Nescafe Joint",
      location: "Next To AC02"
    },
    {
      id:11,
      title:"Amul",
      image: Grey,
      timing: "6am To 12am",
      genre: "Dairy",
      description: "Classic Amul Joint",
      location: "Next To AC02"
    },
    ]

    const colorScheme = useColorScheme();

    useLayoutEffect(()=>{
    }, [colorScheme])

    useEffect(() => {
      const query = `*[_type == "restaurant"]
      {description, location,
        name, image, genre, timing, 
        dishes[]->{name, description, price, image}}`;
    
      client
        .fetch(query)
        .then((data) => {
          console.log('Data:', data); // Log the received data for inspection
          setDRestaurants(data);
        })
        .catch((error) => {
          console.log('Error:', error); // Log any errors that occur
        });
    }, []);
    
console.log(DRestaurants);
  return (
    <ScrollView >
      <View className=' w-11/12 h-48 self-center mt-2 mb-2 rounded-full shadow-md'>
        <Image source={Grey} style={{width: '100%', height: '100%', borderRadius: 15,}} />
      </View>

      <View className='mt-5 border-t' style={[colorScheme=='light'? Styles.LightHomeAdlibBorder : Styles.DarkHomeAdlibBorder]}  >
        <Text 
        className="text-center font-normal text-xs mx-28 mt-3 -top-5" 
        style={[colorScheme=='light'? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]} 
        >
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
            // key={restaurant.id}
            // id={restaurant.id}
            image={restaurant["image"]}
            title={restaurant["name"]}
            timing={restaurant["timing"]}
            genre={restaurant["genre"]}
            location={restaurant["location"]}
            description={restaurant["description"]}
            dishes={restaurant["dishes"]}/>
        ))
      }

      <View className=' w-11/12 h-48 self-center mt-4 mb-2 rounded-full shadow-md'>
        <Image source={Grey} style={{width: '100%', height: '100%', borderRadius: 15,}} />
      </View>
      
      <View className='mt-5 border-t' style={[colorScheme=='light'? Styles.LightHomeAdlibBorder : Styles.DarkHomeAdlibBorder]}  >
        <Text 
        className="text-center font-normal text-xs mx-24 mt-3 -top-5" 
        style={[colorScheme=='light'? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]} 
        >
          TAKE A LOOK AT THESE MENUS!
        </Text>
      </View>

      {/* {
        NDRestaurants.map((restaurant)=>
        (
            <RestaurantCards 
            key={restaurant.id}
            id={restaurant.id}
            image={restaurant.image}
            title={restaurant.title}
            timing={restaurant.timing}
            genre={restaurant.genre}
            location={restaurant.location}
            description={restaurant.description}/>
        ))
      } */}
    </ScrollView>
  )
}

export default Restaurants