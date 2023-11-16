import { Text, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList, ScreenNames } from '../../types';
import styles from '../../Styles/styles';
import Icon from 'react-native-ico-material-design';
type HomeProps = NativeStackScreenProps<ParamList, "Home">


export default function LogOutButton({ route, navigation }: HomeProps) {

    return (
        <View style={styles.logOutContainer} >
            <Pressable onPress={() => { navigation.navigate("Home", {}) }}>
                <Icon name="exit-to-app-button" color="#fff" width={30} height={30} />
            </Pressable>
        </View>
    )
}