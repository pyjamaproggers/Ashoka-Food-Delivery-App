import React, { useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView, useColorScheme, StyleSheet, TouchableOpacity, Text, View, Image, TextInput, ScrollView } from 'react-native';
import { HStack, Skeleton, VStack, useLayout } from 'native-base';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import Styles from '../components/Styles';
import Search from '../assets/searchicon.png';
import { IP } from '@dotenv';
import { LineChart } from 'react-native-chart-kit';

export default function ManageSpendings() {
    const navigation = useNavigation()
    const colorScheme = useColorScheme()
    const [Fetching, setFetching] = useState(true)
    const [userOrders, setUserOrders] = useState([])
    const [totalSpendings, setTotalSpendings] = useState()
    const [chartData, setChartData] = useState({})

    const {
        params: { actualUser },
    } = useRoute()

    const configureData = (data) => {
        setTotalSpendings(data.reduce((total, order) => total + order.orderAmount, 0))
        setChartData(data.map((order, index) => ({
            x: index,
            y: order.orderAmount
        })))
    }


    const fetchOrders = async () => {
        setFetching(true)
        try {
            const response = await fetch(`http://${IP}:8800/api/orders/users/${actualUser.email}`)
            const data = await response.json()
            let tempUserOrders = []
            data.forEach(order => {
                if (!order.orderStatus.includes('Declined')) {
                    tempUserOrders.push(order)
                }
            })
            console.log(tempUserOrders)
            setUserOrders(data.reverse())
            configureData(data)
            setFetching(false)
        } catch (error) {
            console.error("Error while fetching orders on order history page", error)
        }
    }
    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    return (
        <View>
            {totalSpendings && chartData &&
                <>

                    <Text>Total Spending: ₹{totalSpendings}</Text>

                    {/* Spending Trends Chart */}
                    <LineChart
                        data={{
                            datasets: [{ data: chartData }],
                        }}
                        width={300}
                        height={200}
                        chartConfig={{
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                        }}

                    />
                </>
            }

            {/* Other sections for favorite items, restaurants, etc. */}
        </View>
    )
}