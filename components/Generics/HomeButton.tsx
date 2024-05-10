import { Text, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList, ScreenNames } from '../../types';
import styles from '../../Styles/styles';
import Icon from 'react-native-ico-material-design';

type HomeProps = NativeStackScreenProps<ParamList, "MainScreen">


export default function HomeButton({ navigation }: HomeProps) {

    return (
        <View style={styles.HomeContainer} >
            <Pressable onPress={() => { navigation.navigate("MainScreen", {}) }}>
                <Icon name="home-button" height={30} width={30} color="#fff" />
            </Pressable>
        </View>
    )
}