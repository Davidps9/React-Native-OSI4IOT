import { View } from "react-native";
import CancelButton from "./CancelButton";
import SendButton from "./SendButton";
import { ParamList } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";


type HomeProps = NativeStackScreenProps<ParamList, 'TimeSelectorScreen' | 'MqttMessagerScreenForGeolocation' | 'MqttMessagerScreenForAccelerometer' | 'MqttMessagerScreenForGyrosope' | 'MqttMessagerScreenForMotion'>

export default function InputFooter({ HomeProps, handleSend, buttonText }: { HomeProps: HomeProps, handleSend: () => void, buttonText?: string }) {

    const { navigation } = HomeProps;
    return (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
            <CancelButton navigation={navigation} />

            <SendButton width={45} text={buttonText ? buttonText : "Send"} handleSend={handleSend} />

        </View>
    )
}