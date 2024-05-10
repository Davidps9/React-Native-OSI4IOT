import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import styles from "../../styles/styles";


type SendButtonProps = {
    text: string,
    handleSend: () => void,
    width: number

}
export default function SendButton({ text, handleSend, width }: SendButtonProps) {
    return (
        <TouchableOpacity onPress={handleSend} style={[styles.button, { width: `${width}%` }]}  >
            <Text style={styles.textbutton} >{text}</Text>
        </TouchableOpacity>
    )
}