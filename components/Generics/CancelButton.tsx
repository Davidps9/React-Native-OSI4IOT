import { Text, TouchableOpacity } from "react-native"
import styles from "../../styles/styles"
import { DefaultScreenProps } from "../../types"


export default function CancelButton({ navigation }: DefaultScreenProps) {
    return (
        <TouchableOpacity style={[styles.button, { width: '45%' }]} onPress={() => { navigation.goBack() }}  >
            <Text style={styles.textbutton} >Cancel</Text>
        </TouchableOpacity>
    )
}