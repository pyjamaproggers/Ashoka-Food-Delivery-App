import { View, Text, ScrollView, Image, useColorScheme, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import RestaurantCards from '../components/RestaurantCards'
import Grey from '../assets/greysquare.jpeg'
import HomeImage1 from '../assets/HomeImage1.jpeg';
import client from '../sanity'
import { useLayoutEffect } from 'react'
import Styles from '../components/Styles'
import { HStack, Skeleton, VStack } from 'native-base';

const Restaurants = () => {
    const [DRestaurants, setDRestaurants] = useState([]);
    const [NDRestaurants, setNDRestaurants] = useState([]);
    const [Fetching, setFetching] = useState()
    const [Refreshing, setRefreshing] = useState()
    const colorScheme = useColorScheme();

    const query = `*[_type == "restaurant"]
        {description, location, delivery,
        name, image, genre, timing, 
        dishes[]->{name, Veg_NonVeg, Price, image, Menu_category}}`;

    useLayoutEffect(() => {
    }, [colorScheme])

    const fetchRestaurants = (query) => {
        setFetching(true)
        setRefreshing(true)
        window.setTimeout(() => {
            client
                .fetch(query)
                .then((data) => {
                    var drest = []
                    var ndrest = []
                    var i
                    var totalD = 0
                    var totalND = 0
                    for (i = 0; i < data.length; i++) {
                        if (data[i].delivery == 'Yes') {
                            totalD += 1
                        }
                        else {
                            totalND += 1
                        }
                    }

                    if (DRestaurants.length != totalD) {
                        for (i = 0; i < data.length; i++) {
                            if (data[i].delivery == 'Yes') {
                                drest.push(data[i])
                            }
                        }
                        setDRestaurants(drest)
                    }

                    if (NDRestaurants.length != totalND) {
                        for (i = 0; i < data.length; i++) {
                            if (data[i].delivery == 'No') {
                                ndrest.push(data[i])
                            }
                        }
                        setNDRestaurants(ndrest)
                    }
                    setFetching(false)
                    setRefreshing(false)
                })
                .catch((error) => {
                    console.log('Error:', error); // Log any errors that occur
                });
        }, 2000)

    }

    useEffect(() => {
        setFetching(true)
        fetchRestaurants(query)
    }, []);

    return (
        <ScrollView
            contentContainerStyle={{
                paddingBottom: 120
            }}
            refreshControl={
                <RefreshControl refreshing={Refreshing}
                    onRefresh={() => {
                        fetchRestaurants(query);
                    }}
                    />
            }
        >

            <View className=' w-11/12 h-52 self-center mt-2 mb-2 rounded-full shadow-md'>
                <Image source={HomeImage1} style={{ width: '100%', height: '100%', borderRadius: 15, }} />
            </View>

            <View className='mt-5 border-t' style={[colorScheme == 'light' ? Styles.LightHomeAdlibBorder : Styles.DarkHomeAdlibBorder]}  >
                <Text
                    className="text-center font-normal text-xs mx-28 mt-3 -top-5"
                    style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                >
                    WHAT'S ON YOUR MIND?
                </Text>
            </View>

            {/* Loading Skeleton */}
            {Fetching &&
                <View className='mb-3 mx-4 flex-row '>
                    <Skeleton w='24' h='24' rounded='lg'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#0c0c0f'}
                        style={{ marginRight: 16 }}
                    />
                    <VStack flex="3" space="2">
                        <Skeleton h='3' rounded='full' w='50%'
                            startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                            endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        <HStack space="2" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                        <HStack space="1" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                        <HStack space="1" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                    </VStack>
                </View>
            }

            {Fetching &&
                <View className='mb-3 mx-4 flex-row '>
                    <Skeleton w='24' h='24' rounded='lg'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'}
                        style={{ marginRight: 16 }}
                    />
                    <VStack flex="3" space="2">
                        <Skeleton h='3' rounded='full' w='50%'
                            startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                            endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        <HStack space="2" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                        <HStack space="1" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                        <HStack space="1" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                    </VStack>
                </View>
            }

            {Fetching &&
                <View className='mb-3 mx-4 flex-row '>
                    <Skeleton w='24' h='24' rounded='lg'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'}
                        style={{ marginRight: 16 }}
                    />
                    <VStack flex="3" space="2">
                        <Skeleton h='3' rounded='full' w='50%'
                            startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                            endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        <HStack space="2" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                        <HStack space="1" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                        <HStack space="1" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                    </VStack>
                </View>
            }

            {!Fetching &&
                DRestaurants.map((restaurant) =>
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
                        dishes={restaurant["dishes"]} />
                ))
            }

            <View className=' w-11/12 h-48 self-center mt-4 mb-2 rounded-full shadow-md'>
                <Image source={Grey} style={{ width: '100%', height: '100%', borderRadius: 15, }} />
            </View>

            <View className='mt-5 border-t' style={[colorScheme == 'light' ? Styles.LightHomeAdlibBorder : Styles.DarkHomeAdlibBorder]}  >
                <Text
                    className="text-center font-normal text-xs mx-24 mt-3 -top-5"
                    style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                >
                    TAKE A LOOK AT THESE MENUS!
                </Text>
            </View>

            {/* Loading Skeleton */}
            {Fetching &&
                <View className='mb-3 mx-4 flex-row '>
                    <Skeleton w='24' h='24' rounded='lg'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'}
                        style={{ marginRight: 16 }}
                    />
                    <VStack flex="3" space="2">
                        <Skeleton h='3' rounded='full' w='50%'
                            startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                            endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        <HStack space="2" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                        <HStack space="1" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                        <HStack space="1" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                    </VStack>
                </View>
            }

            {Fetching &&
                <View className='mb-3 mx-4 flex-row '>
                    <Skeleton w='24' h='24' rounded='lg'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'}
                        style={{ marginRight: 16 }}
                    />
                    <VStack flex="3" space="2">
                        <Skeleton h='3' rounded='full' w='50%'
                            startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                            endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        <HStack space="2" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                        <HStack space="1" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                        <HStack space="1" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                    </VStack>
                </View>
            }

            {Fetching &&
                <View className='mb-3 mx-4 flex-row '>
                    <Skeleton w='24' h='24' rounded='lg'
                        startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                        endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'}
                        style={{ marginRight: 16 }}
                    />
                    <VStack flex="3" space="2">
                        <Skeleton h='3' rounded='full' w='50%'
                            startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                            endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        <HStack space="2" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                        <HStack space="1" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                        <HStack space="1" alignItems="center">
                            <Skeleton size="4" rounded="full"
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                            <Skeleton h='2' rounded='full' w='70%'
                                startColor={colorScheme == 'light' ? 'gray.100' : '#262626'}
                                endColor={colorScheme == 'light' ? 'gray.300' : '#ococof'} />
                        </HStack>
                    </VStack>
                </View>
            }

            {!Fetching &&
                NDRestaurants.map((restaurant) =>
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
                        dishes={restaurant["dishes"]} />
                ))
            }

        </ScrollView>
    )
}

export default Restaurants