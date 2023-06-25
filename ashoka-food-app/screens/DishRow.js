import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { urlFor } from "../sanity";
import { MinusCircleIcon, PlusCircleIcon } from "react-native-heroicons/solid";
import { addToCart, removeFromCart, selectCartItems } from "../reduxslices/cartslice";
import { useDispatch, useSelector } from "react-redux";
import VegIcon from '../assets/vegicon.png';
import NonVegIcon from '../assets/nonvegicon.png';

const DishRow = ({ id, name, Veg_NonVeg, Price, image, Menu_category }) => {
  const [isPressed, setIsPressed] = React.useState(false);

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
      <TouchableOpacity
        onPress={() => {
          setIsPressed(!isPressed);
        }}
        style={{
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "gray",
          padding: 4,
          borderBottomWidth: isPressed ? 0 : 1,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, paddingRight: 2 }}>
            {Veg_NonVeg === "Veg" ? (
              <Image
                style={{ width: 20, height: 20, resizeMode: "contain" }}
                source={VegIcon}
              />
            ) : (
              <Image
                style={{ width: 20, height: 20, resizeMode: "contain" }}
                source={NonVegIcon}
              />
            )}
            <Text style={{ fontSize: "lg", marginBottom: 1 }}>{name}</Text>
            <Text>₹{Price}</Text>
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
      </TouchableOpacity>
    </>
  );
};

export default DishRow;
