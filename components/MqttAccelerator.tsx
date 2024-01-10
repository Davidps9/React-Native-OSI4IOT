import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Acceleration, ParamList, PayloadForAcceleration } from "../types";
import { useEffect, useState } from "react";
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
import { Subscription } from "expo-sensors/build/Pedometer";
import Paho from "paho-mqtt";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import styles from "../Styles/styles";
import Header from "./Generics/Header";
import CancelButton from "./Generics/CancelButton";
import SendButton from "./Generics/SendButton";
import getTimeStamp from "../utils/getTimeStamp";


type HomeProps = NativeStackScreenProps<ParamList, 'MqttMessagerScreenForAccelerometer'>


export default function Mqtt({ navigation, route }: HomeProps) {

    const [accel, setAccel] = useState<Acceleration>([0, 0, 0]);

    const client: Paho.Client = route.params.client;
    const recordingTime = route.params.recordingTime || 10;
    var message = new Paho.Message(accel.toString());
    const [timestamp, setTimestamp] = useState<string>();

    const [subscribtion, setSubscribtion] = useState<Subscription | null>(null);
    const payload: PayloadForAcceleration = ({ timestamp: '', mobile_accelerations: accel });

    const handleSend = () => {

        const samplingRate = route.params.sampleRate || 20;
        Accelerometer.setUpdateInterval(1000 / samplingRate);
        setSubscribtion(Accelerometer.addListener((data: AccelerometerMeasurement) => setAccel([data.x, data.y, data.z])));
        setTimeout(() => {
            unsubscribe();
        }, recordingTime * 1000);
    }

    useEffect(() => {
        if (client.isConnected()) {
            getTimeStamp(setTimestamp);
            payload.timestamp = timestamp!;
            payload.mobile_accelerations = accel;
            message = new Paho.Message(JSON.stringify(payload));
            message.destinationName = route.params.topic as string;
            client.send(message);
        }
    }, [accel])

    const unsubscribe = () => {
        subscribtion && subscribtion.remove();
        setSubscribtion(null);
    }



    return (
        <View style={[styles.container, { opacity: 1 }]}>
            <Header route={route} navigation={navigation} />
            <Text style={styles.label}>Accelerometer Data</Text>

            <View>
                <View style={styles.textcontainer} >
                    <Text style={styles.label}>x: {accel[0].toFixed(6)} </Text>
                    <Text style={styles.label}>y: {accel[1].toFixed(6)} </Text>
                    <Text style={styles.label}>z: {accel[2].toFixed(6)} </Text>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                        <CancelButton navigation={navigation} />
                        <SendButton text="Send" width={45} handleSend={handleSend} />
                    </View>
                </View>
            </View>
        </View>
    )
}