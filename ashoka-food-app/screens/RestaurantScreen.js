import React, { useLayoutEffect, useRef, useState } from 'react'
import { useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, Image, TextInput, ScrollView, Animated, useColorScheme } from 'react-native'
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon, ClockIcon, MapPinIcon, BoltIcon, PhoneArrowUpRightIcon, XMarkIcon } from 'react-native-heroicons/solid';
import { selectRestaurant, setRestaurant } from '../reduxslices/restaurantSlice'
import { useDispatch } from 'react-redux'
import CartIcon from '../components/CartIcon';
import DishRow from './DishRow';
import { urlFor } from '../sanity';
import Styles from '../components/Styles';
import { HStack, VStack } from 'native-base';
import Accordion from 'react-native-collapsible/Accordion';
import VegIcon from '../assets/vegicon.png';
import NonVegIcon from '../assets/nonvegicon.png';


const RestaurantScreen = () => {
    const [VegDishes, setVegDishes] = useState([]);
    const [VegMenu, setVegMenu] = useState();
    const [showVegMenu, setShowVegMenu] = useState(false);

    const [showNonVegMenu, setShowNonVegMenu] = useState(false)
    const [NonVegMenu, setNonVegMenu] = useState();
    const [NonVegDishes, setNonVegDishes] = useState([]);

    const [SearchedDishes, setSearchedDishes] = useState([]);
    const [activeSections, setActiveSection] = useState([]);

    const [Categories, setCategories] = useState();
    const [multipleSelect] = useState(true);

    const setSections = (sections) => {
        setActiveSection(sections.includes(undefined) ? [] : sections);
    };

    const colorScheme = useColorScheme();

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const scrollA = useRef(new Animated.Value(0)).current;

    const {
        params: {
            id, image, title, genre, timing, location, description, dishes
        },
    } = useRoute();

    const segregateDishes = (dishes) => {
        var TempVegDishes = []
        var TempNonVegDishes = []
        var i, j
        var TempMenuCategories = []
        for (i = 0; i < dishes.length; i++) {
            if (TempMenuCategories.length == 0) {
                TempMenuCategories.push(dishes[i].Menu_category)
            }
            else if (TempMenuCategories.length > 0) {
                var flag = 0
                for (j = 0; j < TempMenuCategories.length; j++) {
                    if (dishes[i].Menu_category != TempMenuCategories[j]) {
                        flag = 0
                    }
                    else {
                        flag = 1
                    }
                    if (TempMenuCategories.filter((x) => (x === dishes[i].Menu_category)).length == 0) {
                        TempMenuCategories.push(dishes[i].Menu_category)
                    }
                }
            }
            if (dishes[i].Veg_NonVeg == 'Veg') {
                TempVegDishes.push(dishes[i])
            }
            else {
                TempNonVegDishes.push(dishes[i])
            }
        }
        setVegDishes(TempVegDishes);
        setNonVegDishes(TempNonVegDishes);

        var TempCategoriesArray = []
        var TempVegMenu = []
        var TempNonVegMenu = []
        for (i = 0; i < TempMenuCategories.length; i++) {
            let section = {
                title: '',
                content: []
            }
            TempCategoriesArray.push(section)
        }
        for (i = 0; i < TempMenuCategories.length; i++) {
            TempCategoriesArray[i]['title'] = TempMenuCategories[i]
        }
        for (i = 0; i < dishes.length; i++) {
            for (j = 0; j < TempCategoriesArray.length; j++) {
                if (dishes[i].Menu_category == TempCategoriesArray[j].title) {
                    TempCategoriesArray[j].content.push(dishes[i])
                }
            }
        }
        setCategories(TempCategoriesArray)
    }

    _renderHeader = (section) => {
        return (
            <View className='mt-3 rounded-lg'
            style={[colorScheme == 'light' ? { backgroundColor: 'white' } : { backgroundColor: '#262626' }]}>
                <Text className='font-medium pl-2 text-lg py-2.5'
                style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                >
                    {section.title}
                </Text>
            </View>
        );
    };

    _renderContent = (section) => {
        {
            return (
                <>
                    {
                        section.content.map((dish) => (
                            <DishRow name={dish.name} Price={dish.Price} Veg_NonVeg={dish.Veg_NonVeg} />
                        ))
                    }
                </>
            )
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    useEffect(() => {
        dispatch(
            setRestaurant({
                description: description, location: location,
                name: title, image: image, genre: null, timing: timing,
                dishes: dishes
            })
            // Menu_category, Price, Veg_NonVeg, image, name
        )
        segregateDishes(dishes)
    }, [dispatch])



    return (
        <>
            <CartIcon />
            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollA } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingBottom: 150
                }}
                style={[colorScheme == 'light' ? { backgroundColor: '#F2F2F2' } : { backgroundColor: '#0c0c0f' }]}
            >
                <View className="relative" >
                    <Animated.Image source={{ uri: urlFor(image).url() }} style={Styles.RestaurantImage(scrollA)} />
                    <TouchableOpacity onPress={navigation.goBack} className="absolute top-14 left-5 p-2 rounded-full" style={[colorScheme == 'light' ? Styles.LightBackButton : Styles.DarkBackButton]}>
                        <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                    </TouchableOpacity>
                </View>

                <View className='w-full flex-row justify-between pl-2 pr-4 py-1 items-center' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                    <VStack space={0.5}>
                        <HStack className='items-center'>
                            <Text className='text-2xl font-semibold' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{title} • </Text>
                            <Text className='italic text-xs pt-0.5 font-medium' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{genre}</Text>
                        </HStack>
                        <VStack space={1}>
                            <HStack space={2} alignContent={'center'}>
                                <ClockIcon opacity={1} color='#F04C0F' size={15} />
                                <Text className='text-xs' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{timing}</Text>
                            </HStack>
                            <HStack space={2} alignContent={'center'}>
                                <MapPinIcon opacity={1} color='#008FFF' size={15} />
                                <Text className='text-xs' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{location}</Text>
                            </HStack>
                            <HStack space={2} alignContent={'center'}>
                                <BoltIcon opacity={1} color='#FDD023' size={15} />
                                <Text className='text-xs' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{description}</Text>
                            </HStack>
                        </VStack>

                    </VStack>

                    {/* Phone Icon */}
                    <PhoneArrowUpRightIcon opacity={1} color='#f87c7c' size={25} />
                </View>

                {/* Menu */}
                <View>
                    <VStack space={1} className='justify-center'>
                        <Text className="px-4 pt-2 pb-1 font-semibold text-xl text-center" style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>
                            Menu
                        </Text>
                        <HStack space={1} className='justify-center content-center pb-1'>

                                <TouchableOpacity className='flex-row content-center'
                                onPress={()=>{
                                    setShowVegMenu(!showVegMenu)
                                }}
                                style={[colorScheme=='light'? [showVegMenu==true? Styles.LightSelectedVegButton : Styles.LightUnselectedVegButton] : [showVegMenu==true? Styles.DarkSelectedVegButton : Styles.DarkUnselectedVegButton]]}>
                                    <Image
                                        style={{ width: 15, height: 15, resizeMode: "contain" }}
                                        source={VegIcon}
                                    />
                                    <Text className='pl-1 font-medium'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                    >
                                        Veg
                                    </Text>
                                    {showVegMenu &&
                                        <XMarkIcon size={17} style={[colorScheme=='light'? {color: '#000000'} : {color: '#ffffff'}]}/>
                                    }
                                </TouchableOpacity>

                                <TouchableOpacity className='flex-row content-center'
                                onPress={()=>{
                                    setShowNonVegMenu(!showNonVegMenu)
                                }}
                                style={[colorScheme=='light'? [showNonVegMenu==true? Styles.LightSelectedNonVegButton : Styles.LightUnselectedNonVegButton] : [showNonVegMenu==true? Styles.DarkSelectedNonVegButton : Styles.DarkUnselectedNonVegButton]]}>
                                    <Image
                                        style={{ width: 15, height: 15, resizeMode: "contain" }}
                                        source={NonVegIcon}
                                    />
                                    <Text className='pl-1 font-medium'
                                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                    >
                                        Non-Veg
                                    </Text>
                                    {showNonVegMenu &&
                                        <XMarkIcon size={17} style={[colorScheme=='light'? {color: '#000000'} : {color: '#ffffff'}]}/>
                                    }
                                </TouchableOpacity>
                        </HStack>
                    </VStack>

                    {Categories &&
                        <Accordion
                            activeSections={activeSections}
                            sections={Categories}
                            touchableComponent={TouchableOpacity}
                            expandMultiple={multipleSelect}
                            renderHeader={_renderHeader}
                            renderContent={_renderContent}
                            duration={400}
                            onChange={setSections}
                        />
                    }



                </View>
            </Animated.ScrollView>
        </>
    );
}

export default RestaurantScreen;

