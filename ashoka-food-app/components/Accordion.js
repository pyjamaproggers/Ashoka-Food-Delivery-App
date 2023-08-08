import * as React from 'react';
import { List } from 'react-native-paper';
import DishRow from '../screens/DishRow';
import { View, useColorScheme, FlatList, StyleSheet } from 'react-native'
import Styles from './Styles';

const CategoryAccordion = ({ section, delivery }) => {
    const [expanded, setExpanded] = React.useState(false);
    const colorScheme = useColorScheme()

    const handlePress = () => setExpanded(!expanded);

    const styles = StyleSheet.create({
        LightAccordionTitle:{
            fontSize: 16, 
            fontWeight: 600,
            color: '#000',
        },
        DarkAccordionTitle:{
            fontSize: 16, 
            fontWeight: 600,
            color: '#fff',
        },
        LightAccordionButton:{
            backgroundColor: '#fff'
        },
        DarkAccordionButton:{
            backgroundColor: '#262626',
        }
    })

    return (
        <View className='my-1.5'
            style={[colorScheme == 'light' ? Styles.LightBGSec : Styles.DarkBGSec]}
        >
            <List.Accordion className=''
                style={[colorScheme == 'light' ? styles.LightAccordionButton : styles.DarkAccordionButton]}
                title={`${section.item.title} (${section.item.content.length})`}
                expanded={expanded}
                onPress={handlePress}
                titleStyle={[colorScheme=='light'? styles.LightAccordionTitle : styles.DarkAccordionTitle]}
                titleNumberOfLines={2}
                rippleColor={colorScheme == 'light' ? '#f9f9f9' : '#363636'}
            >
                <FlatList
                    data={section.item.content}
                    keyExtractor={item => item._id.toString()}
                    renderItem={item => {
                        // console.log(item.item)
                        return (
                            <DishRow name={item.item.name} Price={item.item.Price} Veg_NonVeg={item.item.Veg_NonVeg} delivery={delivery} key={item.item._id} id={item.item._id} Restaurant={item.item.Restaurant} Customizations={item.item.Customizations} />
                        )
                    }}
                />
            </List.Accordion>

        </View>
    )
};

export default CategoryAccordion;