import { ScrollView, Text, View } from 'react-native'
import React from 'react'
import CategoryCard from '../components/CategoryCard'
import THC from '../assets/THC.jpg'
import SubwayIcon from '../assets/subwayicon.png'
import ChicagoPizzaIcon from '../assets/chicagopizzaicon.jpg'
import Dosai from '../assets/dosai.jpg'
import Dhaba from '../assets/dhaba.png'

const Categories = () => {
  return (
    <ScrollView
    contentContainerStyle={{
        paddingHorizontal:15,
        paddingTop:10,
    }}
    horizontal
    showsHorizontalScrollIndicator={false}>
      <CategoryCard image={THC} name = "The Hunger Cycle"/>
      <CategoryCard image={SubwayIcon} name = "Subway"/>
      <CategoryCard image={ChicagoPizzaIcon} name = "Chicago Pizza"/>
      <CategoryCard image={Dhaba} name = "Dhaba"/>
      <CategoryCard image={Dosai} name = "Dosai"/>
    </ScrollView>
  )
}

export default Categories