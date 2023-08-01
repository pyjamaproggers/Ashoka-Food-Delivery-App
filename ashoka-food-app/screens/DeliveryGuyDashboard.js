import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, Linking, useColorScheme, RefreshControl, TextInput, Alert as ReactNativeAlert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import Accordion from 'react-native-collapsible/Accordion';
import { Button as NativeBaseButton, HStack, VStack, Checkbox, Modal, Select, Radio, Slide, Alert, PresenceTransition, useToast, Skeleton } from 'native-base';
import Styles from '../components/Styles';
import ChevronUp from '../assets/chevronupicon.png';
import ChevronDown from '../assets/chevrondownicon.png';
import Delivery from '../assets/deliverybhaiya.png';
import Chef from '../assets/chef.png';
import Siren from '../assets/siren.png';
import Tick from '../assets/verified.png';
import FoodReady from '../assets/foodready.png';
import { ScrollView } from 'react-native';
import Phone from '../assets/phoneicon.png';
import TickCross from '../assets/tickcross.png';
import Cross from '../assets/cross.png';
import Cross2 from '../assets/cross2.png'
import { ExclamationCircleIcon, XCircleIcon } from "react-native-heroicons/solid";
import { XMarkIcon } from "react-native-heroicons/outline";
import Search from '../assets/searchicon.png'
import client from '../sanity'
import VegIcon from '../assets/vegicon.png';
import NonVegIcon from '../assets/nonvegicon.png';
import { useNetInfo } from "@react-native-community/netinfo";
import io from 'socket.io-client';
import { ARYANIP, ZAHAANIP } from '@dotenv'

function DeliveryGuyDashboard () {
    return(
        <>
            
        </>
    )
}

export default DeliveryGuyDashboard;