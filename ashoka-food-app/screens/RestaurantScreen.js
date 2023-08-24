import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, Image, TextInput, ScrollView, Animated, useColorScheme, Linking, RefreshControl, FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon, ClockIcon, MapPinIcon, BoltIcon, PhoneArrowUpRightIcon, XMarkIcon } from 'react-native-heroicons/solid';
import { selectRestaurant, setRestaurant } from '../reduxslices/restaurantSlice'
import { useDispatch, useSelector } from 'react-redux'
import CartIcon from '../components/CartIcon';
import DishRow from './DishRow';
import { urlFor } from '../sanity';
import Styles from '../components/Styles';
import Accordion from 'react-native-collapsible/Accordion';
import VegIcon from '../assets/vegicon.png';
import NonVegIcon from '../assets/nonvegicon.png';
import clockIcon from '../assets/clockicon.png'
import cashIcon from '../assets/cashicon.png'
import phoneIcon from '../assets/phoneicon2.png';
import ChevronUp from '../assets/chevronupicon.png'
import ChevronDown from '../assets/chevrondownicon.png'
import Search from '../assets/searchicon.png'
import { useNetInfo } from "@react-native-community/netinfo";
import { Alert, CloseIcon, HStack, IconButton, PresenceTransition, Slide, VStack, Skeleton } from 'native-base';
import Warning from '../assets/warning.png'
import { addToCart, removeFromCart, selectCartItems, selectCartTotal } from "../reduxslices/cartslice";
import CategoryAccordion from '../components/Accordion';

const RestaurantScreen = () => {
    const [Transitions, setTransitions] = useState(true)
    const [VegDishes, setVegDishes] = useState([]);
    const [VegMenu, setVegMenu] = useState();
    const [showVegMenu, setShowVegMenu] = useState(false);

    const [showNonVegMenu, setShowNonVegMenu] = useState(false)
    const [NonVegMenu, setNonVegMenu] = useState();
    const [NonVegDishes, setNonVegDishes] = useState([]);

    const items = useSelector(selectCartItems)
    const [AllDishes, setAllDishes] = useState([])

    const [SearchedText, setSearchedText] = useState('')
    const [SearchedMenu, setSearchedMenu] = useState([])
    const [SearchedVegMenu, setSearchedVegMenu] = useState([])
    const [SearchedNonVegMenu, setSearchedNonVegMenu] = useState([])
    const [ShowSearchedMenu, setShowSearchedMenu] = useState(false)
    const [ShowSearchedVegMenu, setShowSearchedVegMenu] = useState(false)
    const [ShowSearchedNonVegMenu, setShowSearchedNonVegMenu] = useState(false)

    const [Categories, setCategories] = useState();

    const colorScheme = useColorScheme();
    const netInfo = useNetInfo();

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const scrollA = useRef(new Animated.Value(0)).current;
    const [loadingImage, setLoadingImage] = useState(true)

    const {
        params: {
            id, image, title, genre, timing, delivery, location, description, dishes, veg_nonveg, phone, actualUser,
        },
    } = useRoute();

    const segregateDishes = (dishes) => { 
        const TempMenuCategories = [];
        const TempVegDishes = [];
        const TempNonVegDishes = [];

        dishes.forEach((dish) => {
            if (!TempMenuCategories.includes(dish.Menu_category)) {
                TempMenuCategories.push(dish.Menu_category);
            }

            if (dish.Veg_NonVeg === 'Veg') {
                TempVegDishes.push(dish);
            } else {
                TempNonVegDishes.push(dish);
            }
        });

        const TempCategoriesArray = TempMenuCategories.map((category, index) => ({
            id: index,
            title: category,
            content: []
        }));

        TempCategoriesArray.forEach((category) => {
            dishes.forEach((dish) => {
                if (dish.Menu_category === category.title) {
                    category.content.push(dish);
                }
            });
        });

        const UniqueVegMenuCategories = [...new Set(TempVegDishes.map((dish) => dish.Menu_category))];
        const UniqueNonVegMenuCategories = [...new Set(TempNonVegDishes.map((dish) => dish.Menu_category))];

        const TempVegMenu = UniqueVegMenuCategories.map((category, index) => ({
            id: index,
            title: category,
            content: []
        }));

        TempVegMenu.forEach((category) => {
            TempVegDishes.forEach((dish) => {
                if (dish.Veg_NonVeg === 'Veg' && dish.Menu_category === category.title) {
                    category.content.push(dish);
                }
            });
        });

        const TempNonVegMenu = UniqueNonVegMenuCategories.map((category, index) => ({
            id: index,
            title: category,
            content: []
        }));

        TempNonVegMenu.forEach((category) => {
            TempNonVegDishes.forEach((dish) => {
                if (dish.Veg_NonVeg === 'Non Veg' && dish.Menu_category === category.title) {
                    category.content.push(dish);
                }
            });
        });

        setCategories(TempCategoriesArray);
        setVegDishes(TempVegDishes);
        setNonVegDishes(TempNonVegDishes);
        setVegMenu(TempVegMenu);
        setNonVegMenu(TempNonVegMenu);
    };


    const segregateSearchedDishes = (searched) => { //ChatGPT Optimised
        const TempMenuCategories = [];
        const TempVegMenuCategories = [];
        const TempNonVegMenuCategories = [];

        AllDishes.forEach((dish) => {
            if (!TempMenuCategories.includes(dish.Menu_category)) {
                TempMenuCategories.push(dish.Menu_category);
            }

            if (dish.Veg_NonVeg === 'Veg') {
                TempVegMenuCategories.push(dish.Menu_category);
            } else {
                TempNonVegMenuCategories.push(dish.Menu_category);
            }
        });

        const TempCategoriesArray = TempMenuCategories.map((category, index) => ({
            id: index,
            title: category,
            content: []
        }));

        TempCategoriesArray.forEach((category) => {
            AllDishes.forEach((dish) => {
                if (dish.Menu_category === category.title) {
                    category.content.push(dish);
                }
            });
        });

        const UniqueVegMenuCategories = [...new Set(TempVegMenuCategories)];
        const UniqueNonVegMenuCategories = [...new Set(TempNonVegMenuCategories)];

        const TempVegMenu = UniqueVegMenuCategories.map((category, index) => ({
            id: index,
            title: category,
            content: []
        }));

        TempVegMenu.forEach((category) => {
            AllDishes.forEach((dish) => {
                if (dish.Veg_NonVeg === 'Veg' && dish.Menu_category === category.title) {
                    category.content.push(dish);
                }
            });
        });

        const TempNonVegMenu = UniqueNonVegMenuCategories.map((category, index) => ({
            id: index,
            title: category,
            content: []
        }));

        TempNonVegMenu.forEach((category) => {
            AllDishes.forEach((dish) => {
                if (dish.Veg_NonVeg === 'Non Veg' && dish.Menu_category === category.title) {
                    category.content.push(dish);
                }
            });
        });

        const filterAndSetSearchedMenu = (menu, setMenuFunction) => {
            const TempSearchedMenu = menu.map((category, index) => ({
                id: category.id,
                title: category.title,
                content: category.content.filter(
                    (dish) =>
                        dish.Menu_category.includes(searched) || dish.name.includes(searched)
                )
            }));

            const FinalSearchedMenu = TempSearchedMenu.filter((category) => category.content.length > 0);

            setMenuFunction(FinalSearchedMenu);
        };

        filterAndSetSearchedMenu(TempCategoriesArray, setSearchedMenu);
        filterAndSetSearchedMenu(TempVegMenu, setSearchedVegMenu);
        filterAndSetSearchedMenu(TempNonVegMenu, setSearchedNonVegMenu);
    };

    const updateImageLoader = (value) => {
        setLoadingImage(value)
    }


    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    useMemo(() => {
        dispatch(
            setRestaurant({
                description: description, location: location,
                name: title, image: image, genre: genre, timing: timing,
                dishes: dishes
            })
            // Menu_category, Price, Veg_NonVeg, image, name
        )
        segregateDishes(dishes)
        setAllDishes(dishes)
    }, [dispatch, SearchedText, items])


    return (
        <>

            <CartIcon actualUser={actualUser} />


            <Slide in={!netInfo.isConnected} placement="top">
                <Alert justifyContent="center" status="error" safeAreaTop={10}>
                    <HStack space={3}>
                        <Image source={Warning} className="h-7 w-7" />
                        <Text className='text-md pt-2 font-medium'>
                            Uh oh, you don't seem to be connected...
                        </Text>
                    </HStack>
                </Alert>
            </Slide>


            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollA } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingBottom: 150
                }}
                showsVerticalScrollIndicator={false}
                style={[colorScheme == 'light' ? { backgroundColor: '#F2F2F2' } : { backgroundColor: '#0c0c0f' }]}
            >


                <View className="relative">
                    <Animated.Image
                        source={{ uri: urlFor(image).url() }}
                        style={Styles.RestaurantImage(scrollA)}
                        onLoadStart={() => updateImageLoader(true)}
                        onLoadEnd={() => updateImageLoader(false)}
                    />
                    <TouchableOpacity onPress={navigation.goBack} className="absolute top-14 p-2 rounded-full" style={[colorScheme == 'light' ? Styles.LightBackButton : Styles.DarkBackButton]}>
                        <ArrowLeftIcon size={20} style={[colorScheme == 'light' ? { color: 'black' } : { color: 'white' }]} />
                    </TouchableOpacity>
                </View>

                <View className='w-full flex-row justify-between pl-2 pr-4 py-2.5 items-center rounded-b-2xl shadow-sm' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                    <VStack space={1.5}>
                        <HStack className='items-center border-b ' style={[colorScheme == 'light' ? { borderColor: 'rgb(255,255,255)' } : { borderColor: '#262626' }]}>
                            <Text className='text-2xl font-semibold' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{title} • </Text>
                            <Text className='italic text-xs pt-0.5 font-medium' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{genre}</Text>
                        </HStack>
                        <HStack space={2} className='mb-1'>
                            <HStack space={1} alignContent={'center'} className='content-center'>
                                <Image
                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                    source={clockIcon}
                                />
                                <Text className='text-xs' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>{timing}</Text>
                            </HStack>
                            <HStack space={1} alignContent={'center'}>
                                <Image
                                    style={{ width: 15, height: 15, resizeMode: "contain" }}
                                    source={cashIcon}
                                />
                                <Text className='text-xs' style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}>₹350 for two</Text>
                            </HStack>
                        </HStack>

                    </VStack>

                    {/* Phone Icon */}
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL(`tel:${phone}`)
                        }}>
                        <Image
                            style={{ width: 25, height: 25, resizeMode: "contain" }}
                            source={phoneIcon}
                        />
                    </TouchableOpacity>
                </View>

                {/* Menu */}
                <View>
                    <VStack space={1} className='justify-center'>
                        <View className='mt-7 border-t' style={[colorScheme == 'light' ? Styles.LightHomeAdlibBorder : Styles.DarkHomeAdlibBorder]}  >
                            <Text
                                className="text-center font-semibold text-xl mx-40 mt-3 -top-7 -mb-5"
                                style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                            >
                                Menu
                            </Text>
                        </View>

                        {veg_nonveg == 'Non Veg' &&
                            <HStack space={3} className='justify-center content-center pb-1.5'>

                                <TouchableOpacity className='flex-row content-center'
                                    onPress={() => {
                                        if (SearchedText.length > 0) {
                                            setShowSearchedVegMenu(!ShowSearchedVegMenu)
                                        }
                                        else {
                                            setShowVegMenu(!showVegMenu)
                                        }
                                    }}
                                    style={[colorScheme == 'light' ? [showVegMenu == true || ShowSearchedVegMenu == true ? Styles.LightSelectedVegButton : Styles.LightUnselectedVegButton] : [showVegMenu == true || ShowSearchedVegMenu == true ? Styles.DarkSelectedVegButton : Styles.DarkUnselectedVegButton]]}>
                                    <Image
                                        style={{ width: 15, height: 15, resizeMode: "contain" }}
                                        source={VegIcon}
                                    />
                                    <Text className='pl-1 font-medium'
                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                    >
                                        Veg
                                    </Text>
                                    {(showVegMenu || ShowSearchedVegMenu) &&
                                        <XMarkIcon size={17} style={[colorScheme == 'light' ? { color: '#000000' } : { color: '#ffffff' }]} />
                                    }
                                </TouchableOpacity>

                                <TouchableOpacity className='flex-row content-center'
                                    onPress={() => {
                                        if (SearchedText.length > 0) {
                                            setShowSearchedNonVegMenu(!ShowSearchedNonVegMenu)
                                        }
                                        else {
                                            setShowNonVegMenu(!showNonVegMenu)
                                        }
                                    }}
                                    style={[colorScheme == 'light' ? [showNonVegMenu == true || ShowSearchedNonVegMenu == true ? Styles.LightSelectedNonVegButton : Styles.LightUnselectedNonVegButton] : [showNonVegMenu == true || ShowSearchedNonVegMenu == true ? Styles.DarkSelectedNonVegButton : Styles.DarkUnselectedNonVegButton]]}>

                                    <Image
                                        style={{ width: 15, height: 15, resizeMode: "contain" }}
                                        source={NonVegIcon}
                                    />
                                    <Text className='pl-1 font-medium'
                                        style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                    >
                                        Non-Veg
                                    </Text>
                                    {(showNonVegMenu || ShowSearchedNonVegMenu) &&
                                        <XMarkIcon size={17} style={[colorScheme == 'light' ? { color: '#000000' } : { color: '#ffffff' }]} />
                                    }
                                </TouchableOpacity>

                            </HStack>
                        }
                        {VegMenu && NonVegMenu && AllDishes &&
                            <View className="flex-row item-center space-x-2 mx-4 ">
                                <View className="self-center flex-row flex-1 p-3 mb-2 shadow-sm w-11/12" style={[colorScheme == 'light' ? Styles.LightSearchBar : Styles.DarkSearchBar]}>

                                    <HStack>
                                        <Image
                                            style={{ width: 16, height: 16, resizeMode: "contain", }}
                                            source={Search}
                                        />
                                        {colorScheme == 'light' &&
                                            <TextInput placeholder="What are we looking for today?" keyboardType="default" className='w-full'
                                                style={{ color: '#000', marginLeft: 8, marginRight: -8 }}
                                                onChangeText={(text) => {
                                                    setSearchedText(text)
                                                    if (text && !showVegMenu && !showNonVegMenu) {
                                                        setShowSearchedMenu(true)
                                                        segregateSearchedDishes(text)
                                                    }
                                                    if (text && showVegMenu && !showNonVegMenu) {
                                                        setShowSearchedVegMenu(!ShowSearchedVegMenu)
                                                        segregateSearchedDishes(text)
                                                    }
                                                    if (text && !showVegMenu && showNonVegMenu) {
                                                        setShowSearchedNonVegMenu(!ShowSearchedNonVegMenu)
                                                        segregateSearchedDishes(text)
                                                    }
                                                    if (text && showVegMenu && showNonVegMenu) {
                                                        setShowSearchedMenu(!ShowSearchedMenu)
                                                        segregateSearchedDishes(text)
                                                    }

                                                    if (!text && showVegMenu && !showNonVegMenu) {
                                                        setSearchedText('')
                                                        setShowVegMenu(!showVegMenu)
                                                    }
                                                    if (!text && !showVegMenu && showNonVegMenu) {
                                                        setSearchedText('')
                                                        setShowNonVegMenu(!showNonVegMenu)
                                                    }
                                                    if (!text && !showVegMenu && !showNonVegMenu) {
                                                        setSearchedText('')
                                                        setShowSearchedMenu(!ShowSearchedMenu)
                                                    }
                                                }}
                                                enterKeyHint='done'
                                            />
                                        }
                                        {colorScheme != 'light' &&
                                            <TextInput placeholder="What are we looking for today?" keyboardType="default" className='w-full'
                                                style={{ color: '#fff', marginLeft: 8, marginRight: -8 }}
                                                onChangeText={(text) => {
                                                    setSearchedText(text)
                                                    if (text && !showVegMenu && !showNonVegMenu) {
                                                        setShowSearchedMenu(true)
                                                        segregateSearchedDishes(text)
                                                    }
                                                    if (text && showVegMenu && !showNonVegMenu) {
                                                        setShowSearchedVegMenu(!ShowSearchedVegMenu)
                                                        segregateSearchedDishes(text)
                                                    }
                                                    if (text && !showVegMenu && showNonVegMenu) {
                                                        setShowSearchedNonVegMenu(!ShowSearchedNonVegMenu)
                                                        segregateSearchedDishes(text)
                                                    }
                                                    if (text && showVegMenu && showNonVegMenu) {
                                                        setShowSearchedMenu(!ShowSearchedMenu)
                                                        segregateSearchedDishes(text)
                                                    }

                                                    if (!text && showVegMenu && !showNonVegMenu) {
                                                        setSearchedText('')
                                                        setShowVegMenu(!showVegMenu)
                                                    }
                                                    if (!text && !showVegMenu && showNonVegMenu) {
                                                        setSearchedText('')
                                                        setShowNonVegMenu(!showNonVegMenu)
                                                    }
                                                    if (!text && !showVegMenu && !showNonVegMenu) {
                                                        setSearchedText('')
                                                        setShowSearchedMenu(!ShowSearchedMenu)
                                                    }
                                                }}
                                                enterKeyHint='done'
                                            />
                                        }
                                    </HStack>

                                </View>
                            </View>
                        }
                    </VStack>


                    {Categories && !showVegMenu && !showNonVegMenu && !ShowSearchedMenu && !ShowSearchedVegMenu && !ShowSearchedNonVegMenu && SearchedText.length == 0 &&
                        <FlatList
                            data={Categories}
                            keyExtractor={item => item.id.toString()}
                            renderItem={item => (
                                <CategoryAccordion section={item} delivery={delivery} />
                            )}
                        />
                    }

                    {VegMenu && showVegMenu && !showNonVegMenu && !ShowSearchedMenu && !ShowSearchedVegMenu && !ShowSearchedNonVegMenu &&
                        <FlatList
                            data={VegMenu}
                            keyExtractor={item => item.id.toString()}
                            renderItem={item => (
                                <CategoryAccordion section={item} delivery={delivery} />
                            )}
                        />
                    }

                    {NonVegMenu && !showVegMenu && showNonVegMenu && !ShowSearchedMenu && !ShowSearchedVegMenu && !ShowSearchedNonVegMenu &&
                        <FlatList
                            data={NonVegMenu}
                            keyExtractor={item => item.id.toString()}
                            renderItem={item => (
                                <CategoryAccordion section={item} delivery={delivery} />
                            )}
                        />
                    }

                    {Categories && showVegMenu && showNonVegMenu && !ShowSearchedMenu && !ShowSearchedVegMenu && !ShowSearchedNonVegMenu &&
                        <FlatList
                            data={Categories}
                            keyExtractor={item => item.id.toString()}
                            renderItem={item => (
                                <CategoryAccordion section={item} delivery={delivery} />
                            )}
                        />
                    }

                    {ShowSearchedMenu && !ShowSearchedVegMenu && !ShowSearchedNonVegMenu &&
                        <FlatList
                            data={SearchedMenu}
                            keyExtractor={item => item.id.toString()}
                            renderItem={item => (
                                <CategoryAccordion section={item} delivery={delivery} />
                            )}
                        />
                    }

                    {ShowSearchedMenu && ShowSearchedVegMenu && !ShowSearchedNonVegMenu &&
                        <FlatList
                            data={SearchedVegMenu}
                            keyExtractor={item => item.id.toString()}
                            renderItem={item => (
                                <CategoryAccordion section={item} delivery={delivery} />
                            )}
                        />
                    }

                    {ShowSearchedMenu && !ShowSearchedVegMenu && ShowSearchedNonVegMenu &&
                        <FlatList
                            data={SearchedNonVegMenu}
                            keyExtractor={item => item.id.toString()}
                            renderItem={item => (
                                <CategoryAccordion section={item} delivery={delivery} />
                            )}
                        />
                    }

                    {ShowSearchedMenu && ShowSearchedVegMenu && ShowSearchedNonVegMenu &&
                        <FlatList
                            data={SearchedMenu}
                            keyExtractor={item => item.id.toString()}
                            renderItem={item => (
                                <CategoryAccordion section={item} delivery={delivery} />
                            )}
                        />
                    }


                </View>
            </Animated.ScrollView>
        </>
    );
}

export default RestaurantScreen;

