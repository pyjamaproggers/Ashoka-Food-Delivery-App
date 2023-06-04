import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const CategoryCard = ({image, name}) => {
  return (
    <TouchableOpacity className='relative mr-2'>
        <Image source={image} className="h-20 w-20 rounded" style={{
            alignSelf: 'center',
            borderRadius: 75
        }}/>
      {/* <Text className="absolute bottom-1 left-1 text-white">{name}</Text> */}
    </TouchableOpacity>
  )
}

export default CategoryCard