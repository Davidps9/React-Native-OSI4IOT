import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Acceleration, ParamList, PayloadForAcceleration } from "../types";
import { useEffect, useState } from "react";
import { DeviceMotion } from "expo-sensors";
import { Subscription } from "expo-sensors/build/Pedometer";
import Paho from "paho-mqtt";
import { View, Text } from "react-native";
import styles from "../Styles/styles";
import Header from "./generics/Header";
import getTimeStamp from "../utils/getTimeStamp";
import Results from "./generics/Results";
import InputFooter from "./generics/InputFooter";
import { unsubscribe } from "../utils/unSubscribe";

type HomeProps = NativeStackScreenProps<ParamList, 'MqttMessagerScreenForAccelerometer'>;

export default function Mqtt({ navigation, route }: HomeProps) {

    const [accel, setAccel] = useState<Acceleration>([0, 0, 0]);
    const client: Paho.Client = route.params.client;
    const recordingTime = route.params.recordingTime || 10;
    const [subscribtion, setSubscribtion] = useState<Subscription | null>(null);
    const payload: PayloadForAcceleration = ({ timestamp: '', mobile_accelerations: accel });

    const handleSend = () => {
        const samplingRate = route.params.sampleRate || 20;
        DeviceMotion.setUpdateInterval(1000 / samplingRate);
        setSubscribtion(DeviceMotion.addListener(({ acceleration }) => { if (acceleration === null || acceleration === undefined) { return } setAccel([acceleration.x, acceleration.y, acceleration.z]) }));
        setTimeout(() => {
            unsubscribe({ subscribtion, setSubscribtion });
        }, recordingTime * 1000);
    }

    useEffect(() => {
        if (client.isConnected()) {
            payload.timestamp = getTimeStamp();
            payload.mobile_accelerations = accel;
            const message = new Paho.Message(JSON.stringify(payload));
            message.destinationName = route.params.topic as string;
            client.send(message);
        }
    }, [accel])




    return (
        <>
            <Header route={route} navigation={navigation} />
            <View style={styles.container}>
                <Text style={styles.label}>Accelerometer Data</Text>
                <View>
                    <View style={styles.textcontainer} >
                        <Results labels={["X", "Y", "Z"]} data={accel} fixed />
                        <InputFooter HomeProps={{ route, navigation }} handleSend={handleSend} />
                    </View>
                </View>
            </View>
        </>
    )
}