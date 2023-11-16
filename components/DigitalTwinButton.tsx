import { Text, Pressable, View } from "react-native";
import styles from "../Styles/styles";
import { DefaultScreenProps, DigitalTwinProps } from "../types";
import Icon from "react-native-ico-material-design";



export default function DigitalTwin({ index, digitalTwin, angle, navigation, route }: DigitalTwinProps) {
    const distance = 135;
    const [x, y] = [Math.cos(angle * index), Math.sin(angle * index)];

    console.log('x: ', x, 'y: ', y, 'angle: ', angle)

    const handleClick = () => {
        navigation.navigate('DigitalTwinScreen', { accessToken: route.params.accessToken, topic: '', message: '', userName: route.params.userName, PlatformDomain: route.params.PlatformDomain, })
    }

    return (
        <View style={{ position: 'absolute', top: 140, right: 140 }} key={index}>
            <Pressable key={index} style={[styles.DigitalTwinIcon, { top: y * distance, left: x * distance }]} onPress={handleClick}>
                <Icon name="settings-cogwheel-button" height={30} width={30} color="#fff" />
            </Pressable>
        </View>
    )
}