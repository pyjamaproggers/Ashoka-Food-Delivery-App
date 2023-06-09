import { View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme, } from 'react-native'
import React from 'react'
import { StarIcon, ClockIcon, MapPinIcon, BoltIcon } from "react-native-heroicons/solid";
import { } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { urlFor } from '../sanity';
import Styles from './Styles';
import clockIcon from '../assets/clockicon.png'
import mapPinIcon from '../assets/mappinicon.png'
import boltIcon from '../assets/bolticon.png'
import Dhaba from '../assets/dhabaicon.png';
import Rotiboti from '../assets/rotibotiicon.png';
import Subway from '../assets/subwayicon.png';
import Rasananda from '../assets/rasanandaicon.png';
import Chaat from '../assets/chaaticon.png';
import THC from '../assets/thcicon.png';
import Amul from '../assets/amulicon.png';
import Nescafe from '../assets/nescafeicon.png'
import Dosai from '../assets/dosaiicon.png';
import ChicagoPizza from '../assets/chicagopizzaicon.png';
import Fuelzone from '../assets/fuelzoneicon.png';
import Chaishai from '../assets/chaishaiicon.png';

const RestaurantCards = ({ id, image, title, genre, timing, delivery, location, description, dishes, veg_nonveg }) => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    return (
        <View className='shadow'>
            <TouchableOpacity onPress={() => {
                navigation.navigate('Restaurant', {
                    id, image, title, genre, timing, delivery, location, description, dishes, veg_nonveg
                })
            }} className="mb-3 rounded-xl mx-4 " style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>

                <View className='flex-row place-items-start w-24 h-24'>

                    <Image source={{ uri: urlFor(image).url() }} className="h-full w-full" resizeMode='stretch' style={styles.restaurantImage} />

                    <View className="px-3 flex-column">
                        <Text className="font-semibold text-lg pt-1 pb-1 pl-0.5"
                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                        >
                            {title}
                        </Text>

                        <View className="flex-row items-center space-x-1 mb-1 w-60">
                            <Image
                                style={{ width: 16, height: 16, resizeMode: "contain" }}
                                source={clockIcon}
                            />
                            <Text className="flex-row text-xs text-gray-600"
                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                            >
                                {timing}
                            </Text>
                        </View>

                        <View className="flex-row items-center space-x-1 mb-1">
                            <Image
                                style={{ width: 16, height: 16, resizeMode: "contain" }}
                                source={mapPinIcon}
                            />
                            <Text className="text-xs text-gray-600"
                                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                            >
                                {location}
                            </Text>
                        </View>

                        <View className="flex-row items-center space-x-1 mb-1">
                            {title=='Dhaba' &&
                                <Image
                                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                                    source={Dhaba}
                                />
                            }
                            {title=='Roti Boti' &&
                                <Image
                                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                                    source={Rotiboti}
                                />
                            }
                            {title=='Rasananda' &&
                                <Image
                                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                                    source={Rasananda}
                                />
                            }
                            {title=='Chicago Pizza' &&
                                <Image
                                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                                    source={ChicagoPizza}
                                />
                            }
                            {title=='Chaat Stall' &&
                                <Image
                                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                                    source={Chaat}
                                />
                            }
                            {title=='Subway' &&
                                <Image
                                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                                    source={Subway}
                                />
                            }
                            {title=='Amul' &&
                                <Image
                                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                                    source={Amul}
                                />
                            }
                            {title=='Dosai' &&
                                <Image
                                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                                    source={Dosai}
                                />
                            }
                            {title=='Fuelzone' &&
                                <Image
                                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                                    source={Fuelzone}
                                />
                            }
                            {title=='The Hunger Cycle' &&
                                <Image
                                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                                    source={THC}
                                />
                            }
                            {title=='Chai Shai' &&
                                <Image
                                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                                    source={Chaishai}
                                />
                            }
                            {title=='Nescafe' &&
                                <Image
                                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                                    source={Nescafe}
                                />
                            }
                            <Text className="text-xs text-gray-600" style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                                {description}
                            </Text>
                        </View>
                    </View>

                </View>

            </TouchableOpacity>
        </View>
    )
}

export default RestaurantCards

const styles = StyleSheet.create({
    restaurantImage: {
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12
    }
})