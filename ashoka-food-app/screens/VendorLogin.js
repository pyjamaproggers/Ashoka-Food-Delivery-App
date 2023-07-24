import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

function VendorLogin (){
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    return(
        <View>
            <Text>
            Hello
            </Text>
        </View>
    )
}

export default VendorLogin;