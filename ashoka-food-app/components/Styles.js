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
        borderRadius: '8px',
        borderWidth: '1px',
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
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: '#FFFFFF',
    },
    DarkDropdownButton:{
        height: 40,
        borderRadius: '8px',
        borderWidth: '1px',
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
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: '#262626',
    },
    LightDropdownMenu:{
        width: '100%',
        height: 200,
        borderRadius: '6px',
        borderWidth: '1px',
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
        borderRadius: '6px',
        borderWidth: '1px',
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
        borderBottomWidth: '1px',
        borderColor: 'rgb(229, 231, 235)',
        paddingLeft: 8,
    },
    DarkDropdownItem:{
        borderBottomWidth: '1px',
        borderColor: 'rgb(75, 85, 99)',
        paddingLeft: 8,
    },
    LightDropdownText:{
        color: 'black',
        paddingTop: 10,
        paddingBottom: 10
    },
    DarkDropdownText:{
        color: 'white',
        paddingTop: 10,
        paddingBottom: 10
    },
    LightSearchBar:{
        backgroundColor: 'white',
        borderRadius: '10px',
        borderWidth: '1px',
        borderColor: 'rgb(229,231,235)',
    },
    DarkSearchBar:{
        backgroundColor: '#262626',
        borderRadius: '10px',
        borderWidth: '1px',
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

});

export default Styles;