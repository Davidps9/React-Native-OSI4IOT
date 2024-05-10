import { View } from "react-native";
import { DefaultScreenProps } from "../../types";
import styles from "../../styles/styles";
import LogOutButton from "./LogOutButton";
import HomeButton from "./HomeButton";

export default function HeaderComponent({ route, navigation }: DefaultScreenProps) {
    return (
        <View style={styles.Header}>
            <HomeButton route={route} navigation={navigation} />
            <LogOutButton route={route} navigation={navigation} />
        </View>
    )
}