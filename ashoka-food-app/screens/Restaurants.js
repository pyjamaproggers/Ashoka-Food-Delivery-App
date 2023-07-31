import { View, Text, ScrollView, Image, useColorScheme, RefreshControl, Animated, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import RestaurantCards from '../components/RestaurantCards'
import Grey from '../assets/greysquare.jpeg'
import HomeImage1 from '../assets/HomeImage1.jpeg';
import HomeImage2 from '../assets/HomeBG2.jpeg';
import HomeImage3 from '../assets/HomeImage3.jpg';
import client from '../sanity'
import { useLayoutEffect } from 'react'
import Styles from '../components/Styles'
import { FlatList, HStack, Skeleton, VStack } from 'native-base';
import ChevronUp from '../assets/chevronupicon.png'
import ChevronDown from '../assets/chevrondownicon.png'

const Restaurants = (props) => {
    const [DRestaurants, setDRestaurants] = useState([]);
    const [NDRestaurants, setNDRestaurants] = useState([]);
    const [Fetching, setFetching] = useState()
    const [Refreshing, setRefreshing] = useState()
    const colorScheme = useColorScheme();
    const Searched = props.searched
    const actualUser = props.actualUser
    const [SearchedRestaurants, setSearchedRestaurants] = useState([])

    const scrollY = useRef(new Animated.Value(0)).current;
    const { height, width } = Dimensions.get('screen');
    const imageWidth = width * 0.95;
    const imageHeight = imageWidth * 0.7

    const query = `*[_type == "restaurant"]
        {description, location, delivery,
        name, image, genre, timing, Veg_NonVeg, CostForTwo, RestaurantPhone,
        dishes[]->{name, Veg_NonVeg, Price, image, Menu_category, Restaurant ,_id}}`;

    useLayoutEffect(() => {
    }, [colorScheme])

    const fetchRestaurants = (query) => {
        setFetching(true)
        setRefreshing(true)
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
                    if (data[i].name == 'Roti Boti') {
                        console.log(data[i].dishes)
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

    }

    const handleSearchedRestaurants = (Searched) => {
        const TempSearchedRestaurants = []
        DRestaurants.map((rest, index) => {
            rest.dishes.map((dish, index) => {
                if (rest.name.includes(Searched) || dish.Menu_category.includes(Searched) || dish.name.includes(Searched)) {
                    if (!TempSearchedRestaurants.includes(rest)) {
                        TempSearchedRestaurants.push(rest)
                    }
                }
            })
        })
        NDRestaurants.map((rest, index) => {
            rest.dishes.map((dish, index) => {
                if (rest.name.includes(Searched) || dish.Menu_category.includes(Searched) || dish.name.includes(Searched)) {
                    if (!TempSearchedRestaurants.includes(rest)) {
                        TempSearchedRestaurants.push(rest)
                    }
                }
            })
        })
        setSearchedRestaurants(TempSearchedRestaurants)
    }

    useEffect(() => {
        setFetching(true)
        fetchRestaurants(query)
        if (Searched) {
            handleSearchedRestaurants(Searched)
        }
    }, [Searched]);

    return (
        <>
            {!Searched &&
                <>
                    <Animated.ScrollView
                        contentContainerStyle={{
                            paddingBottom: 120
                        }}
                        refreshControl={
                            <RefreshControl refreshing={Refreshing}
                                onRefresh={() => {
                                    fetchRestaurants(query);
                                    props.LoadJoke(true)
                                }}
                            />
                        }
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true },
                        )}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                    >


                        <View className='self-center mt-2 mb-2 shadow-md'
                            style={{
                                width: imageWidth,
                                height: imageHeight,
                                overflow: 'hidden',
                                borderRadius: 15,
                                alignItems: 'center'
                            }}
                        >
                            <Animated.Image source={HomeImage1}
                                style={{
                                    width: imageWidth,
                                    height: imageHeight * 1.18,
                                    resizeMode: 'cover',
                                    borderRadius: 15,
                                    transform: [
                                        {
                                            translateY: scrollY.interpolate({
                                                inputRange: [-200, 0, 200],
                                                outputRange: [-height * 0.075, 0, height * 0.2]
                                            })
                                        }
                                    ]
                                }} />
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
                                    delivery={restaurant["delivery"]}
                                    genre={restaurant["genre"]}
                                    location={restaurant["location"]}
                                    description={restaurant["description"]}
                                    dishes={restaurant["dishes"]}
                                    veg_nonveg={restaurant["Veg_NonVeg"]}
                                    phone={restaurant["RestaurantPhone"]}
                                    actualUser={actualUser} />
                            ))
                        }

                        <View className='self-center mt-2 mb-2 shadow-md'
                            style={{
                                width: imageWidth,
                                height: imageHeight,
                                overflow: 'hidden',
                                borderRadius: 15,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Animated.Image source={HomeImage2}
                                style={{
                                    width: imageWidth,
                                    height: imageHeight * 2.8,
                                    resizeMode: 'cover',
                                    borderRadius: 15,
                                    transform: [
                                        {
                                            translateY: scrollY.interpolate({
                                                inputRange: [525, 1000, 1475,],
                                                outputRange: [-height * 0.4, 0, height * 0.4,]
                                            })
                                        }
                                    ]
                                }} />
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
                                    key={restaurant._id}
                                    id={restaurant._id}
                                    image={restaurant["image"]}
                                    title={restaurant["name"]}
                                    timing={restaurant["timing"]}
                                    delivery={restaurant["delivery"]}
                                    genre={restaurant["genre"]}
                                    location={restaurant["location"]}
                                    description={restaurant["description"]}
                                    dishes={restaurant["dishes"]}
                                    veg_nonveg={restaurant["Veg_NonVeg"]}
                                    phone={restaurant["RestaurantPhone"]}
                                    actualUser={actualUser} />
                            ))
                        }

                        <VStack>
                            <Text
                                allowFontScaling={false}
                                className='self-center text-center font-semibold mt-8 text-md italic w-full'
                                style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                            >
                                Brought to you by
                            </Text>
                            <Text
                                allowFontScaling={false}
                                className='self-center text-center font-semibold mb-6 text-md italic w-full'
                                style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                            >
                                Aryan Yadav & Zahaan Shapoorjee
                            </Text>
                        </VStack>

                    </Animated.ScrollView>

                    
                </>
            }
            {Searched &&
                <View className='h-screen' style={[colorScheme == 'light' ? { backgroundColor: '#F2F2F2' } : { backgroundColor: '#0c0c0f' }]}>
                    <View className='mt-5 border-t' style={[colorScheme == 'light' ? Styles.LightHomeAdlibBorder : Styles.DarkHomeAdlibBorder]}  >
                        <Text

                            className="text-center font-normal text-xs mx-20 mt-3 -top-5"
                            style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                        >
                            IS THIS WHAT YOU"RE LOOKING FOR?
                        </Text>
                    </View>
                    <ScrollView>
                        {SearchedRestaurants &&
                            SearchedRestaurants.map((restaurant) =>
                            (
                                <RestaurantCards
                                    // key={restaurant.id}
                                    // id={restaurant.id}
                                    image={restaurant["image"]}
                                    title={restaurant["name"]}
                                    timing={restaurant["timing"]}
                                    delivery={restaurant["delivery"]}
                                    genre={restaurant["genre"]}
                                    location={restaurant["location"]}
                                    description={restaurant["description"]}
                                    dishes={restaurant["dishes"]}
                                    veg_nonveg={restaurant["Veg_NonVeg"]}
                                    phone={restaurant["RestaurantPhone"]}
                                    actualUser={actualUser} />
                            ))
                        }
                    </ScrollView>
                </View>
            }
        </>
    )
}

export default Restaurants;
