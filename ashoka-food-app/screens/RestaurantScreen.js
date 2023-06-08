import React, {useLayoutEffect} from 'react'
import { useRoute, useNavigation} from '@react-navigation/native';
import { View, Text, Image, TextInput, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon, StarIcon, MapPinIcon, QuestionMarkCircleIcon } from 'react-native-heroicons/solid';

const RestaurantScreen = () =>
{
    const navigation = useNavigation();

    const {
        params: {
            id, image, title, genre, rating, location, description
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
                    <ArrowLeftIcon size={20} color="#00CCBB"/>
                </TouchableOpacity>
            </View>
            <View className="bg-white">
                <View className="px-4 pt-4">
                    <Text className="font-bold text-3xl">
                    {title}
                    </Text>
                    <View className="flex-row space-x-2 my-1">
                        <View>
                            <StarIcon opacity={0.5} color='green' size={15}/>
                        </View>
                        <View>
                        <Text className="text-green-500">{rating} </Text>
                        </View>
                        <View>
                        <Text className="italic">{genre}</Text>
                        </View>
                        <View className="flex-row">
                        <MapPinIcon size={15} color="gray"/>
                        <Text className="text-xs">{location}</Text>
                        </View>
                        <View>
                        </View>
                    </View>
                    <Text className="text-gray-500 mt-2 pb-4">{description}</Text>
                </View>
                
            </View>
        </ScrollView>
    );
}

export default RestaurantScreen;

