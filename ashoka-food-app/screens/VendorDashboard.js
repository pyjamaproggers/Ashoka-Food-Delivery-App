import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';

function VendorDashboard() {
  const route = useRoute();
  const { selectedRestaurant } = route.params;
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://10.77.1.70:8800/api/orders/${selectedRestaurant}`);
        const data = await response.json();
        setOrders(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [selectedRestaurant]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
            <ArrowLeftIcon size={20} style={{ color: 'white' }} />
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{selectedRestaurant}</Text>
        </View>
        <View>
          <Text style={{ color: 'white', fontSize: 18, marginBottom: 8 }}>Orders</Text>
          {orders.map((order) => (
            <View key={order._id} style={{ backgroundColor: 'white', padding: 16, marginBottom: 16, borderRadius: 8 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Name: {order.name}</Text>
              <Text>Email: {order.email}</Text>
              <Text>Phone: {order.phone}</Text>
              <Text>Order Amount: {order.orderAmount}</Text>
              <Text>Order Date: {order.orderDate}</Text>
              <Text>Order Instructions: {order.orderInstructions}</Text>
              <Text>Delivery Location: {order.deliveryLocation}</Text>

              {/* Display the ordered items for this order */}
              <View style={{ marginTop: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Ordered Items:</Text>
                {order.orderItems.map((item, index) => (
                  <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{item.name}</Text>
                    <Text>Rs.{item.price}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default VendorDashboard;
