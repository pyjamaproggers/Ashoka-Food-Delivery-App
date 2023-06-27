import { View, Text, TouchableOpacity, Image, useColorScheme } from "react-native";
import React from "react";
import { urlFor } from "../sanity";
import { MinusCircleIcon, PlusCircleIcon } from "react-native-heroicons/solid";
import { addToCart, removeFromCart, selectCartItems } from "../reduxslices/cartslice";
import { useDispatch, useSelector } from "react-redux";
import VegIcon from '../assets/vegicon.png';
import NonVegIcon from '../assets/nonvegicon.png';
import Styles from "../components/Styles";

const DishRow = ({ id, name, Veg_NonVeg, Price, image, Menu_category }) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const colorScheme = useColorScheme();
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const itemQuantity = items.filter(item => item.name === name).length;

    const addItem = () => {
        dispatch(addToCart({ id, name, Price, image }));
    };

    const removeItem = () => {
        dispatch(removeFromCart({ id, name, Price, image }));
    };

    return (
        <>
            <View className='flex-row px-2 py-4' style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}>
                <View style={{ flex: 1, paddingRight: 2 }}>
                    {Veg_NonVeg === "Veg" ? (
                        <Image
                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                            source={VegIcon}
                        />
                    ) : (
                        <Image
                            style={{ width: 15, height: 15, resizeMode: "contain" }}
                            source={NonVegIcon}
                        />
                    )}
                    <Text className='text-lg font-medium py-1.5'
                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                    >
                        {name}
                    </Text>
                    <Text 
                    style={[colorScheme == 'light' ? Styles.LightTextPrimary : Styles.DarkTextPrimary]}
                    >
                        ₹{Price} 
                    </Text>
                </View>
            <View>
                    {/* {
              image!==null?(<Image
                style={{ borderWidth: 1, borderColor: '#F3F3F4' }}
                source={{ uri: urlFor(image).url() }}
                className="h-20 w-20 bg-gray-300 p-4"
              />):(<></>)
            } */}
            </View>

                <View style={{ backgroundColor: "white", padding: 4 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingBottom: 3,
                        }}
                    >
                        <TouchableOpacity disabled={!itemQuantity} onPress={removeItem}>
                            <MinusCircleIcon
                                color={itemQuantity > 0 ? "#00CCBB" : "gray"}
                                size={25}
                            />
                        </TouchableOpacity>
                        <Text>{itemQuantity}</Text>
                        <TouchableOpacity onPress={addItem}>
                            <PlusCircleIcon color="#cb202d" size={25} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
};

export default DishRow;
