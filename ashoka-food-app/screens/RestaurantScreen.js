import React, { useLayoutEffect, useRef, useState } from 'react'
import { useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, Image, TextInput, ScrollView, Animated, useColorScheme, Linking, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native';
import { ArrowLeftIcon, ClockIcon, MapPinIcon, BoltIcon, PhoneArrowUpRightIcon, XMarkIcon } from 'react-native-heroicons/solid';
import { selectRestaurant, setRestaurant } from '../reduxslices/restaurantSlice'
import { useDispatch } from 'react-redux'
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
import { Alert, CloseIcon, HStack, IconButton, PresenceTransition, Slide, VStack } from 'native-base';
import Warning from '../assets/warning.png'

const RestaurantScreen = () => {
    const [Transitions, setTransitions] = useState(true)
    const [VegDishes, setVegDishes] = useState([]);
    const [VegMenu, setVegMenu] = useState();
    const [showVegMenu, setShowVegMenu] = useState(false);

    const [showNonVegMenu, setShowNonVegMenu] = useState(false)
    const [NonVegMenu, setNonVegMenu] = useState();
    const [NonVegDishes, setNonVegDishes] = useState([]);

    const [AllDishes, setAllDishes] = useState([])

    const [SearchedText, setSearchedText] = useState('')
    const [SearchedMenu, setSearchedMenu] = useState([])
    const [SearchedVegMenu, setSearchedVegMenu] = useState([])
    const [SearchedNonVegMenu, setSearchedNonVegMenu] = useState([])
    const [ShowSearchedMenu, setShowSearchedMenu] = useState(false)
    const [ShowSearchedVegMenu, setShowSearchedVegMenu] = useState(false)
    const [ShowSearchedNonVegMenu, setShowSearchedNonVegMenu] = useState(false)

    const [activeSections, setActiveSection] = useState([]);

    const [Categories, setCategories] = useState();
    const [multipleSelect] = useState(true);

    const setSections = (sections) => {
        setActiveSection(sections.includes(undefined) ? [] : sections);
    };

    const colorScheme = useColorScheme();
    const netInfo = useNetInfo();

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const scrollA = useRef(new Animated.Value(0)).current;

    const {
        params: {
            id, image, title, genre, timing, delivery, location, description, dishes, veg_nonveg, phone, actualUser
        },
    } = useRoute();

    const segregateDishes = (dishes) => {
        var TempVegDishes = []
        var TempVegMenuCategories = []
        var TempNonVegDishes = []
        var TempNonVegMenuCategories = []
        var i, j
        var TempMenuCategories = []

        for (i = 0; i < dishes.length; i++) {

            if (TempMenuCategories.length == 0) {
                TempMenuCategories.push(dishes[i].Menu_category)
            }
            else if (TempMenuCategories.length > 0) {
                var flag = 0
                for (j = 0; j < TempMenuCategories.length; j++) {

                    if (TempMenuCategories.filter((x) => (x === dishes[i].Menu_category)).length == 0) {
                        TempMenuCategories.push(dishes[i].Menu_category)
                    }
                }
            }

            if (dishes[i].Veg_NonVeg == 'Veg') {
                TempVegDishes.push(dishes[i])
                TempVegMenuCategories.push(dishes[i].Menu_category)
            }
            else {
                TempNonVegDishes.push(dishes[i])
                TempNonVegMenuCategories.push(dishes[i].Menu_category)
            }

        }
        var UniqueVegMenuCategories = [... new Set(TempVegMenuCategories)]
        var UniqueNonVegMenuCategories = [... new Set(TempNonVegMenuCategories)]

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

        for (i = 0; i < UniqueVegMenuCategories.length; i++) {
            let section = {
                title: '',
                content: []
            }
            TempVegMenu.push(section)
        }
        for (i = 0; i < UniqueVegMenuCategories.length; i++) {
            TempVegMenu[i]['title'] = UniqueVegMenuCategories[i]
        }
        for (i = 0; i < dishes.length; i++) {
            for (j = 0; j < TempVegMenu.length; j++) {
                if (dishes[i].Veg_NonVeg == 'Veg' && dishes[i].Menu_category == TempVegMenu[j].title) {
                    TempVegMenu[j].content.push(dishes[i])
                }
            }
        }
        setVegMenu(TempVegMenu)

        for (i = 0; i < UniqueNonVegMenuCategories.length; i++) {
            let section = {
                title: '',
                content: []
            }
            TempNonVegMenu.push(section)
        }
        for (i = 0; i < UniqueNonVegMenuCategories.length; i++) {
            TempNonVegMenu[i]['title'] = UniqueNonVegMenuCategories[i]
        }
        for (i = 0; i < dishes.length; i++) {
            for (j = 0; j < TempNonVegMenu.length; j++) {
                if (dishes[i].Veg_NonVeg == 'Non Veg' && dishes[i].Menu_category == TempNonVegMenu[j].title) {
                    TempNonVegMenu[j].content.push(dishes[i])
                }
            }
        }
        setNonVegMenu(TempNonVegMenu)
    }

    const segregateSearchedDishes = (searched) => {
        var TempMenuCategories = []
        var TempVegMenuCategories = []
        var TempNonVegMenuCategories = []
        var i, j

        for (i = 0; i < AllDishes.length; i++) {

            if (TempMenuCategories.length == 0) {
                TempMenuCategories.push(AllDishes[i].Menu_category)
            }
            else if (TempMenuCategories.length > 0) {
                var flag = 0
                for (j = 0; j < TempMenuCategories.length; j++) {

                    if (TempMenuCategories.filter((x) => (x === AllDishes[i].Menu_category)).length == 0) {
                        TempMenuCategories.push(AllDishes[i].Menu_category)
                    }
                }
            }

            if (AllDishes[i].Veg_NonVeg == 'Veg') {
                TempVegMenuCategories.push(AllDishes[i].Menu_category)
            }
            else {
                TempNonVegMenuCategories.push(AllDishes[i].Menu_category)
            }

        }
        var UniqueVegMenuCategories = [... new Set(TempVegMenuCategories)]
        var UniqueNonVegMenuCategories = [... new Set(TempNonVegMenuCategories)]


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
        for (i = 0; i < AllDishes.length; i++) {
            for (j = 0; j < TempCategoriesArray.length; j++) {
                if (AllDishes[i].Menu_category == TempCategoriesArray[j].title) {
                    TempCategoriesArray[j].content.push(AllDishes[i])
                }
            }
        }

        for (i = 0; i < UniqueVegMenuCategories.length; i++) {
            let section = {
                title: '',
                content: []
            }
            TempVegMenu.push(section)
        }
        for (i = 0; i < UniqueVegMenuCategories.length; i++) {
            TempVegMenu[i]['title'] = UniqueVegMenuCategories[i]
        }
        for (i = 0; i < AllDishes.length; i++) {
            for (j = 0; j < TempVegMenu.length; j++) {
                if (AllDishes[i].Veg_NonVeg == 'Veg' && AllDishes[i].Menu_category == TempVegMenu[j].title) {
                    TempVegMenu[j].content.push(AllDishes[i])
                }
            }
        }

        for (i = 0; i < UniqueNonVegMenuCategories.length; i++) {
            let section = {
                title: '',
                content: []
            }
            TempNonVegMenu.push(section)
        }
        for (i = 0; i < UniqueNonVegMenuCategories.length; i++) {
            TempNonVegMenu[i]['title'] = UniqueNonVegMenuCategories[i]
        }
        for (i = 0; i < AllDishes.length; i++) {
            for (j = 0; j < TempNonVegMenu.length; j++) {
                if (AllDishes[i].Veg_NonVeg == 'Non Veg' && AllDishes[i].Menu_category == TempNonVegMenu[j].title) {
                    TempNonVegMenu[j].content.push(AllDishes[i])
                }
            }
        }

        var TempSearchedMenu = []
        var FinalSearchedMenu = []
        var TempSearchedVegMenu = []
        var FinalSearchedVegMenu = []
        var TempSearchedNonVegMenu = []
        var FinalSearchedNonVegMenu = []

        for (i = 0; i < TempCategoriesArray.length; i++) {
            let section = {
                title: '',
                content: []
            }
            TempSearchedMenu.push(section)
        }
        for (i = 0; i < TempCategoriesArray.length; i++) {
            TempSearchedMenu[i]['title'] = TempCategoriesArray[i].title
        }
        for (i = 0; i < TempCategoriesArray.length; i++) {
            for (j = 0; j < TempCategoriesArray[i].content.length; j++) {
                if (TempCategoriesArray[i].content[j].Menu_category.includes(searched) || TempCategoriesArray[i].content[j].name.includes(searched)) {
                    TempSearchedMenu[i].content.push(TempCategoriesArray[i].content[j])
                }
            }
        }
        for (i = 0; i < TempSearchedMenu.length; i++) {
            if (TempSearchedMenu[i].content.length != 0) {
                FinalSearchedMenu.push(TempSearchedMenu[i])
            }
        }
        // console.log(FinalSearchedMenu) //Finally searched menu
        setSearchedMenu(FinalSearchedMenu)


        for (i = 0; i < TempVegMenu.length; i++) {
            let section = {
                title: '',
                content: []
            }
            TempSearchedVegMenu.push(section)
        }
        for (i = 0; i < TempVegMenu.length; i++) {
            TempSearchedVegMenu[i]['title'] = TempVegMenu[i].title
        }
        for (i = 0; i < TempVegMenu.length; i++) {
            for (j = 0; j < TempVegMenu[i].content.length; j++) {
                if (TempVegMenu[i].content[j].Menu_category.includes(searched) || TempVegMenu[i].content[j].name.includes(searched)) {
                    TempSearchedVegMenu[i].content.push(TempVegMenu[i].content[j])
                }
            }
        }
        for (i = 0; i < TempSearchedVegMenu.length; i++) {
            if (TempSearchedVegMenu[i].content.length != 0) {
                FinalSearchedVegMenu.push(TempSearchedVegMenu[i])
            }
        }
        // console.log(FinalSearchedVegMenu) //Finally searched veg menu
        setSearchedVegMenu(FinalSearchedVegMenu)


        for (i = 0; i < TempNonVegMenu.length; i++) {
            let section = {
                title: '',
                content: []
            }
            TempSearchedNonVegMenu.push(section)
        }
        for (i = 0; i < TempNonVegMenu.length; i++) {
            TempSearchedNonVegMenu[i]['title'] = TempNonVegMenu[i].title
        }
        for (i = 0; i < TempNonVegMenu.length; i++) {
            for (j = 0; j < TempNonVegMenu[i].content.length; j++) {
                if (TempNonVegMenu[i].content[j].Menu_category.includes(searched) || TempNonVegMenu[i].content[j].name.includes(searched)) {
                    TempSearchedNonVegMenu[i].content.push(TempNonVegMenu[i].content[j])
                }
            }
        }
        for (i = 0; i < TempSearchedNonVegMenu.length; i++) {
            if (TempSearchedNonVegMenu[i].content.length != 0) {
                FinalSearchedNonVegMenu.push(TempSearchedNonVegMenu[i])
            }
        }
        // console.log(FinalSearchedNonVegMenu) //Finally searched NonVeg menu
        setSearchedNonVegMenu(FinalSearchedNonVegMenu)

    }

    _renderHeader = (section, _, isActive) => {
        return (
            <HStack className='mt-3 shadow-sm items-center justify-between pr-3'
                style={[colorScheme == 'light' ? [isActive == true ? Styles.LightActiveAccordionButton : Styles.LightInactiveAccordionButton] : [isActive == true ? Styles.DarkActiveAccordionButton : Styles.DarkInactiveAccordionButton]]}
            >
                <Text className='font-semibold pl-2 text-lg py-3'
                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                >
                    {section.title}
                </Text>
                {isActive ?
                    <Image
                        style={{ width: 12, height: 12, resizeMode: "contain" }}
                        source={ChevronUp}
                    />
                    :
                    <Image
                        style={{ width: 12, height: 12, resizeMode: "contain" }}
                        source={ChevronDown}
                    />
                }
            </HStack>
        );
    }

    _renderContent = (section) => {
        {
            return (
                <>
                    {
                        section.content.map((dish) => (
                            <DishRow name={dish.name} Price={dish.Price} Veg_NonVeg={dish.Veg_NonVeg} delivery={delivery} key={dish._id} id={dish._id} Restaurant={dish.Restaurant} />
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
        setAllDishes(dishes)
        window.setTimeout(() => {
            setTransitions(false)
        }, 300)
    }, [dispatch, SearchedText])



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

                <PresenceTransition visible={true} initial={{
                    translateY: -300
                }} animate={{
                    translateY: 0,
                    transition: {
                        duration: 250,
                        delay: 25
                    }
                }}>
                    <View className="relative">
                        <Animated.Image source={{ uri: urlFor(image).url() }} style={Styles.RestaurantImage(scrollA)} />
                        <TouchableOpacity onPress={navigation.goBack} className="absolute top-14 left-5 p-2 rounded-full" style={[colorScheme == 'light' ? Styles.LightBackButton : Styles.DarkBackButton]}>
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
                </PresenceTransition>

                {/* Menu */}
                <View>
                    <VStack space={1} className='justify-center'>
                        <PresenceTransition visible={true} initial={{
                            translateY: -300
                        }} animate={{
                            translateY: 0,
                            transition: {
                                duration: 250,
                                delay: 25
                            }
                        }}>
                            <View className='mt-7 border-t' style={[colorScheme == 'light' ? Styles.LightHomeAdlibBorder : Styles.DarkHomeAdlibBorder]}  >
                                <Text
                                    className="text-center font-semibold text-xl mx-40 mt-3 -top-7 -mb-5"
                                    style={[colorScheme == 'light' ? Styles.LightHomeAdlib : Styles.DarkHomeAdlib]}
                                >
                                    Menu
                                </Text>
                            </View>

                        </PresenceTransition>
                        {veg_nonveg == 'Non Veg' &&
                            <HStack space={3} className='justify-center content-center pb-3'>

                                <PresenceTransition visible={true} initial={{
                                    translateY: -500
                                }} animate={{
                                    translateY: 0,
                                    transition: {
                                        duration: 250
                                    }
                                }}>
                                    <TouchableOpacity className='flex-row content-center'
                                        onPress={() => {
                                            if (ShowSearchedMenu) {
                                                setShowSearchedVegMenu(!ShowSearchedVegMenu)
                                                if (showVegMenu == true) {
                                                    setShowVegMenu(false)
                                                }
                                            }
                                            else {
                                                setShowVegMenu(!showVegMenu)
                                            }
                                        }}
                                        style={[colorScheme == 'light' ? [showVegMenu == true || ShowSearchedVegMenu == true ? Styles.LightSelectedVegButton : Styles.LightUnselectedVegButton] : [showVegMenu == true ? Styles.DarkSelectedVegButton : Styles.DarkUnselectedVegButton]]}>
                                        <Image
                                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                                            source={VegIcon}
                                        />
                                        <Text className='pl-1 font-medium'
                                            style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                                        >
                                            Veg
                                        </Text>
                                        {console.log(showVegMenu)}
                                        {(showVegMenu || ShowSearchedVegMenu) &&
                                            <XMarkIcon size={17} style={[colorScheme == 'light' ? { color: '#000000' } : { color: '#ffffff' }]} />
                                        }
                                    </TouchableOpacity>
                                </PresenceTransition>

                                <PresenceTransition visible={true} initial={{
                                    translateY: -500
                                }} animate={{
                                    translateY: 0,
                                    transition: {
                                        duration: 250
                                    }
                                }}>
                                    <TouchableOpacity className='flex-row content-center'
                                        onPress={() => {
                                            if (ShowSearchedMenu) {
                                                setShowSearchedNonVegMenu(!ShowSearchedNonVegMenu)
                                                if (showNonVegMenu == true) {
                                                    setShowNonVegMenu(false)
                                                }
                                            }
                                            else {
                                                setShowNonVegMenu(!showNonVegMenu)
                                            }
                                        }}
                                        style={[colorScheme == 'light' ? [showNonVegMenu == true || ShowSearchedNonVegMenu == true ? Styles.LightSelectedNonVegButton : Styles.LightUnselectedNonVegButton] : [showNonVegMenu == true ? Styles.DarkSelectedNonVegButton : Styles.DarkUnselectedNonVegButton]]}>

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
                                </PresenceTransition>

                            </HStack>
                        }
                        {VegMenu && NonVegMenu && AllDishes &&
                            <View className="flex-row item-center space-x-2 mx-4 ">
                                <View className="self-center flex-row flex-1 p-3 shadow-sm w-11/12" style={[colorScheme == 'light' ? Styles.LightSearchBar : Styles.DarkSearchBar]}>

                                    <Image
                                        style={{ width: 16, height: 16, resizeMode: "contain", }}
                                        source={Search}
                                    />
                                    {colorScheme == 'light' &&
                                        <TextInput placeholder="What are we looking for today?" keyboardType="default" className='w-full'
                                            style={{ color: '#000', marginLeft: 8, marginRight: -8 }}
                                            onChangeText={(text) => {
                                                setSearchedText(text)
                                                if (text) {
                                                    setShowSearchedMenu(true)
                                                    segregateSearchedDishes(text)
                                                }
                                                else {
                                                    setSearchedText('')
                                                    setShowSearchedMenu(false)
                                                }
                                            }} />
                                    }
                                    {colorScheme != 'light' &&
                                        <TextInput placeholder="What are we looking for today?" keyboardType="default" className='w-full'
                                            style={{ color: '#fff', marginLeft: 8, marginRight: -8 }}
                                            onChangeText={(text) => {
                                                setSearchedText(text)
                                                if (text) {
                                                    segregateSearchedDishes(text)
                                                    setShowSearchedMenu(true)
                                                }
                                                else {
                                                    setSearchedText('')
                                                    setShowSearchedMenu(false)
                                                }
                                            }} />
                                    }
                                </View>
                            </View>
                        }
                    </VStack>

                    <PresenceTransition visible={true} initial={{
                        translateY: 500
                    }} animate={{
                        translateY: 0,
                        transition: {
                            duration: 250
                        }
                    }}>

                        {Categories && !showVegMenu && !showNonVegMenu && !ShowSearchedMenu && !ShowSearchedVegMenu && !ShowSearchedNonVegMenu && SearchedText.length == 0 &&

                            <Accordion
                                activeSections={activeSections}
                                sections={Categories}
                                touchableComponent={TouchableOpacity}
                                expandMultiple={multipleSelect}
                                renderHeader={_renderHeader}
                                renderContent={_renderContent}
                                duration={200}
                                onChange={setSections}
                            />
                        }

                        {VegMenu && showVegMenu && !showNonVegMenu && !ShowSearchedMenu && !ShowSearchedVegMenu && !ShowSearchedNonVegMenu &&
                            <Accordion
                                activeSections={activeSections}
                                sections={VegMenu}
                                touchableComponent={TouchableOpacity}
                                expandMultiple={multipleSelect}
                                renderHeader={_renderHeader}
                                renderContent={_renderContent}
                                duration={200}
                                onChange={setSections}
                            />
                        }

                        {NonVegMenu && !showVegMenu && showNonVegMenu && !ShowSearchedMenu && !ShowSearchedVegMenu && !ShowSearchedNonVegMenu &&
                            <Accordion
                                activeSections={activeSections}
                                sections={NonVegMenu}
                                touchableComponent={TouchableOpacity}
                                expandMultiple={multipleSelect}
                                renderHeader={_renderHeader}
                                renderContent={_renderContent}
                                duration={200}
                                onChange={setSections}
                            />
                        }

                        {Categories && showVegMenu && showNonVegMenu && !ShowSearchedMenu && !ShowSearchedVegMenu && !ShowSearchedNonVegMenu &&
                            <Accordion
                                activeSections={activeSections}
                                sections={Categories}
                                touchableComponent={TouchableOpacity}
                                expandMultiple={multipleSelect}
                                renderHeader={_renderHeader}
                                renderContent={_renderContent}
                                duration={200}
                                onChange={setSections}
                            />
                        }

                        {ShowSearchedMenu && !ShowSearchedVegMenu && !ShowSearchedNonVegMenu &&
                            <Accordion
                                activeSections={activeSections}
                                sections={SearchedMenu}
                                touchableComponent={TouchableOpacity}
                                expandMultiple={multipleSelect}
                                renderHeader={_renderHeader}
                                renderContent={_renderContent}
                                duration={200}
                                onChange={setSections}
                            />
                        }

                        {ShowSearchedMenu && ShowSearchedVegMenu && !ShowSearchedNonVegMenu &&
                            <Accordion
                                activeSections={activeSections}
                                sections={SearchedVegMenu}
                                touchableComponent={TouchableOpacity}
                                expandMultiple={multipleSelect}
                                renderHeader={_renderHeader}
                                renderContent={_renderContent}
                                duration={200}
                                onChange={setSections}
                            />
                        }

                        {ShowSearchedMenu && !ShowSearchedVegMenu && ShowSearchedNonVegMenu &&
                            <Accordion
                                activeSections={activeSections}
                                sections={SearchedNonVegMenu}
                                touchableComponent={TouchableOpacity}
                                expandMultiple={multipleSelect}
                                renderHeader={_renderHeader}
                                renderContent={_renderContent}
                                duration={200}
                                onChange={setSections}
                            />
                        }

                        {ShowSearchedMenu && ShowSearchedVegMenu && ShowSearchedNonVegMenu &&
                            <Accordion
                                activeSections={activeSections}
                                sections={SearchedMenu}
                                touchableComponent={TouchableOpacity}
                                expandMultiple={multipleSelect}
                                renderHeader={_renderHeader}
                                renderContent={_renderContent}
                                duration={200}
                                onChange={setSections}
                            />
                        }

                    </PresenceTransition>


                </View>
            </Animated.ScrollView>
        </>
    );
}

export default RestaurantScreen;

