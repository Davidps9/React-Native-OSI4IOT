import { View } from "react-native";
import HomeButton from "./HomeButton";
import LogOutButton from "./LogOutButton";
import { DefaultScreenProps, ParamList, ScreenNames } from "../../types";
import styles from "../../Styles/styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";



export default function HeaderComponent({ route, navigation }: DefaultScreenProps) {
    return (
        <View style={styles.Header}>
            <HomeButton route={route} navigation={navigation} />
            <LogOutButton route={route} navigation={navigation} />
        </View>
    )
}