import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { urlFor } from "../sanity";
import { MinusCircleIcon, PlusCircleIcon } from "react-native-heroicons/solid";
import { addToCart, removeFromCart } from "../reduxslices/cartslice";
import { useDispatch, useSelector } from "react-redux";

const DishRow = ({ id, name, description, price, image }) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const addItem = () => {
    dispatch(addToCart({ id, name, description, price, image }));
  };
  const removeItem = () => {
    dispatch(removeFromCart());
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => setIsPressed(!isPressed)}
        style={`bg-white border p-4 border-gray-200 ${
          isPressed ? "border-b-0" : ""
        }`}
      >
        <View style="flex-row">
          <View style="flex-1 pr-2">
            <Text style="text-l mb-1">{name}</Text>
            <View></View>
            <Text style="text-gray-400">{description}</Text>
            <Text style="text-gray-400 mt-2">{price}</Text>
          </View>
          <View>
            <Image
              style={{ borderWidth: 1, borderColor: "#f3f3f4" }}
              className="h-20 w-20 bg-gray-300"
              source={{
                // uri: urlFor(image.asset._ref).url(),
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
      {isPressed && (
        <View style="bg-white px-4">
          <View style="flex-row items-center space-x-2 pb-3">
            <TouchableOpacity disabled={!items.length} onPress={removeItem}>
              <MinusCircleIcon
                color={items.length > 0 ? "#00ccbb" : "grey"}
                size={40}
              />
            </TouchableOpacity>

            <Text>{items.length}</Text>

            <TouchableOpacity onPress={addItem}>
              <PlusCircleIcon color="#00ccbb" size={40} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default DishRow;