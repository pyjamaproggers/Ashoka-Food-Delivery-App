import React from "react";
import {StyleSheet} from 'react-native';

const Styles = StyleSheet.create({
    DarkBG: {
        backgroundColor: '#0c0c0f'
    },
    LightBG:{
        backgroundColor: '#F2F2F2'
    },
    DarkBGSec: {
        backgroundColor: '#262626'
    },
    LightBGSec:{
        backgroundColor: 'white'
    },
    LightTextPrimary:{
        color: 'black'
    },
    LightTextSecondary:{
        color: 'rgb(156,163,175)'
    },
    DarkTextPrimary: {
        color: 'white'
    },
    DarkTextSecondary:{
        color: 'rgb(107, 114, 128)'
    },
    LightDropdownButton:{
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgb(229,231,235)',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 3,
        shadowOpacity: 0.05,
        marginTop: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 0,
        paddingRight: 10,
        backgroundColor: '#FFFFFF',
    },
    DarkDropdownButton:{
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#262626',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 3,
        shadowOpacity: 0.05,
        marginTop: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 0,
        paddingRight: 10,
        backgroundColor: '#262626',
    },
    LightDropdownMenu:{
        width: '100%',
        height: 200,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgb(229,231,235)',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 3,
        shadowOpacity: 0.05,
        backgroundColor: 'white',
        position: 'absolute',
        top: '100%',
    },
    DarkDropdownMenu:{
        width: '100%',
        height: 200,
        borderRadius: 6,
        borderTopWidth: 1,
        borderColor: 'rgb(0,0,0)',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 3,
        shadowOpacity: 0.05,
        backgroundColor: '#262626',
        position: 'absolute',
        top: '100%',
    },
    LightDropdownItem:{
        borderBottomWidth: 1,
        borderColor: 'rgb(229, 231, 235)',
        paddingLeft: 8,
    },
    DarkDropdownItem:{
        borderBottomWidth: 1,
        borderColor: 'rgb(75, 85, 99)',
        paddingLeft: 8,
    },
    LightDropdownText:{
        color: 'black',
        paddingTop: '5%',
        paddingBottom: '5%'
    },
    DarkDropdownText:{
        color: 'white',
        paddingTop: '5%',
        paddingBottom: '5%'
    },
    LightSearchBar:{
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgb(229,231,235)',
    },
    DarkSearchBar:{
        backgroundColor: '#262626',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgb(0,0,0)',
    },
    LightHomeAdlib:{
        color: 'rgb(156, 163, 175)',
        backgroundColor: '#F2F2F2'
    },
    DarkHomeAdlib:{
        color: 'rgb(107, 114, 128)',
        backgroundColor: '#0c0c0f'
    },
    LightHomeAdlibBorder:{
        borderColor: 'rgb(209, 213, 219)'
    },
    DarkHomeAdlibBorder:{
        borderColor: 'rgb(75, 85, 99)'
    },
    LightUserDetailsBorder:{
        borderBottomWidth: 1,
        borderColor: 'rgb(229, 231, 235)'
    },
    DarkUserDetailsBorder:{
        borderBottomWidth: 1,
        borderColor: 'rgb(75, 85, 99)'
    },

    LightUserDetailsBorderLast:{
        borderBottomWidth: 1,
        borderColor: 'white'
    },
    DarkUserDetailsBorderLast:{
        borderBottomWidth: 1,
        borderColor: '#262626'
    },
    RestaurantImage: scrollA => ({
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        transform: [
            {
                translateY: scrollA.interpolate({
                    inputRange: [-200, 0, 200, 201],
                    outputRange: [-200/2, 0, 200 * 0.25, 200 * 0.1]
                }),
            },
            {
                scale: scrollA.interpolate({
                    inputRange: [-200, 0, 200, 201],
                    outputRange: [2, 1, 1, 1]
                })
            }
        ],
        backgroundColor: '#f2f2f2'
    }),
    LightBackButton: {
        width: "10%",
        marginLeft: 20,
        backgroundColor: 'white'
    },
    DarkBackButton:{
        width: "10%",
        marginLeft: 20,
        backgroundColor: '#262626'
    },


    LightSelectedVegButton: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f87c7c',
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },
    LightUnselectedVegButton: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },

    DarkSelectedVegButton: {
        backgroundColor: '#262626',
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f87c7c',
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },
    DarkUnselectedVegButton: {
        backgroundColor: '#262626',
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#262626',
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },

    LightSelectedNonVegButton: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f87c7c',
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },
    LightUnselectedNonVegButton: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },

    DarkSelectedNonVegButton: {
        backgroundColor: '#262626',
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f87c7c',
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },
    DarkUnselectedNonVegButton: {
        backgroundColor: '#262626',
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#262626',
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },


    LightActiveAccordionButton:{
        backgroundColor: 'white',
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    LightInactiveAccordionButton:{
        backgroundColor: 'white',
        borderRadius: 8,
    },
    DarkActiveAccordionButton:{
        backgroundColor: '#262626',
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    DarkInactiveAccordionButton:{
        backgroundColor: '#262626',
        borderRadius: 8
    },


    LightAddButtonInitial:{
        justifyContent: 'center',
        textAlign: 'center',
        color: '#f87c7c',
        paddingTop: 8,
        paddingRight: 8,
        paddingLeft: 16,
        paddingBottom: 8,
        backgroundColor: '#f7f9ff',
        marginRight: '5%',
        borderRadius: 8,
        borderColor: '#3E5896',
        borderWidth: 1,
        height: 'auto',
        width: 100,
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },
    DarkAddButtonInitial:{
        justifyContent: 'center',
        color: '#f87c7c',
        paddingTop: 8,
        paddingRight: 8,
        paddingLeft: 16,
        paddingBottom: 8,
        backgroundColor: '#0c0c0c',
        marginRight: '5%',
        borderRadius: 8,
        borderColor: '#3E5896',
        borderWidth: 1,
        height: 'auto',
        width: 100,
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },

    LightAddButtonFinal:{
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#f87c7c',
        padding: 1,
        backgroundColor: '#3E5896',
        marginRight: '5%',
        borderRadius: 8,
        borderColor: '#3E5896',
        borderWidth: 1,
        height: 'auto',
        width: 100,
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },
    DarkAddButtonFinal:{
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        color: '#f87c7c',
        padding: 1,
        backgroundColor: '#3E5896',
        marginRight: '5%',
        borderRadius: 8,
        borderColor: '#3E5896',
        borderWidth: 1,
        height: 'auto',
        width: 100,
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },

    NextButton:{
        borderRadius: 8,
        width: '40%',
        justifyContent: 'center'
    },

    ShowCartButton:{
        width: '40%',
        justifyContent: 'center'
    },

    LightCartButton: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowRadius: 3,
        shadowOpacity: 0.05,
    },
    DarkCartButton: {
        backgroundColor: '#262626',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowRadius: 3,
        shadowOpacity: 0.05,
    },  

    LightHomeAdlibCart:{
        color: 'rgb(156, 163, 175)',
        backgroundColor: '#fff'
    },
    DarkHomeAdlibCart:{
        color: 'rgb(107, 114, 128)',
        backgroundColor: '#262626'
    },
    LightHomeAdlibCartBorder:{
        borderColor: 'rgb(209, 213, 219)'
    },
    DarkHomeAdlibCartBorder:{
        borderColor: 'rgb(75, 85, 99)'
    },

    LightAddButtonFinalOrder:{
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#f87c7c',
        padding: 1,
        backgroundColor: '#3E5896',
        marginRight: '5%',
        borderRadius: 8,
        borderColor: '#3E5896',
        borderWidth: 1,
        height: 35,
        width: 100,
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },
    DarkAddButtonFinalOrder:{
        justifyContent: 'space-evenly',
        alignContent: 'center',
        alignItems: 'center',
        color: '#f87c7c',
        padding: 1,
        backgroundColor: '#3E5896',
        marginRight: '5%',
        borderRadius: 8,
        borderColor: '#3E5896',
        borderWidth: 1,
        height: 35,
        width: 100,
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 3,
        shadowOpacity: 0.1,
    },

    LightActivePurpleBTN:{
        borderRadius: 7.5,
        padding: 4,
        backgroundColor: '#ddd6fe'
    },
    DarkActivePurpleBTN:{
        borderRadius: 7.5,
        padding: 4,
        backgroundColor: '#ddd6fe'
    },

    LightActiveBlueBTN:{
        borderRadius: 7.5,
        padding: 4,
        backgroundColor: '#bfdbfe'
    },
    DarkActiveBlueBTN:{
        borderRadius: 7.5,
        padding: 4,
        backgroundColor: '#bfdbfe'
    },

    LightActiveGreenBTN:{
        borderRadius: 7.5,
        padding: 4,
        backgroundColor: '#bbf7d0'
    },
    DarkActiveGreenBTN:{
        borderRadius: 7.5,
        padding: 4,
        backgroundColor: '#bbf7d0'
    },

    LightInactiveBTN:{
        borderRadius: 7.5,
        padding: 4,
        backgroundColor: '#ffffff'
    },
    DarkInactiveBTN:{
        borderRadius: 7.5,
        padding: 4,
        backgroundColor: '#262626'
    },

});

export default Styles;