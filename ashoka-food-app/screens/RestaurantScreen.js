import React, {useLayoutEffect} from 'react'
import { useRoute, useNavigation} from '@react-navigation/native';
import { View, Text, Image, TextInput, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon, ClockIcon, MapPinIcon, BoltIcon} from 'react-native-heroicons/solid';

const RestaurantScreen = () =>
{
    const navigation = useNavigation();

    const {
        params: {
            id, image, title, genre, timing, location, description
        },
    } = useRoute();

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    return(
        <ScrollView>
            <View className="relative">
                <Image source={image} className="w-full h-56 bg-gray-300 p-4"/>
                <TouchableOpacity onPress={navigation.goBack} className="absolute top-14 left-5 p-2 bg-gray-100 rounded-full">
                    <ArrowLeftIcon size={20} color="black"/>
                </TouchableOpacity>
            </View>
            <View className="bg-white flex-1">
                <View className="px-4 pt-4 items-center">
                    <Text className="font-semibold text-3xl pb-2">
                    {title}
                    </Text>
                    <Text className='items-center justify-center pb-2 italic text-lg'>{genre}</Text>
                    <View className="flex-1 space-x-2 space-y-2 my-1">
                        <View className='flex-row items-center'>
                            <ClockIcon opacity={1} color='#F04C0F' size={20} />
                            <Text className="text-md pl-1 text-gray-1000 items-center">{timing} </Text>
                        </View>
                    </View>
                    <View className="flex-1 space-x-2 space-y-2 my-1">
                        <View className='flex-row items-center'>
                            <MapPinIcon opacity={1} color='#2989D6' size={20} />
                            <Text className="text-md pl-1 text-gray-1000 items-center">{location} </Text>
                        </View>
                    </View>
                    <View className="flex-1 space-x-2 space-y-2 my-1 pb-1">
                        <View className='flex-row items-center'>
                            <BoltIcon opacity={1} color='#FDD023' size={20} />
                            <Text className="text-md pl-1 text-gray-1000 items-center">{description} </Text>
                        </View>
                    </View>
                </View>
                
            </View>
        </ScrollView>
    );
}

export default RestaurantScreen;

