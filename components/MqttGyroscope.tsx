import { Pressable, Text, TouchableOpacity, View } from "react-native"
import styles from "../Styles/styles";
import Paho from 'paho-mqtt';
import { useEffect, useState } from "react";
import { DeviceMotion, DeviceMotionMeasurement } from "expo-sensors";
import { Subscription } from "expo-sensors/build/Pedometer";
import { Quaternion } from "../utils/Threejs/Quaternion";
import { Euler } from "../utils/Threejs/Euler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ParamList, PayloadForQuaternion } from "../types";
import Header from "./Generics/Header";
import CancelButton from "./Generics/CancelButton";
import ProgressBar from "./Generics/ProgressBar";
import SendButton from "./Generics/SendButton";

type HomeProps = NativeStackScreenProps<ParamList, 'MqttMessagerScreenForGyrosope'>


export default function Mqtt({ navigation, route }: HomeProps) {

    const [subscribtion, setSubscribtion] = useState<Subscription | null>(null);
    const [euler, setEuler] = useState<Euler>(new Euler(0, 0, 0, 'YXZ'));
    const [quaternion, setQuaternion] = useState<Quaternion>(new Quaternion(0, 0, 0, 0));
    const [connected, setConnected] = useState<boolean>(false);
    const samplingRate = route.params.sampleRate || 20;
    const client: Paho.Client = route.params.client;
    const [timestamp, setTimestamp] = useState<string>();
    const [counter, setCounter] = useState<number>(0);

    const payload: PayloadForQuaternion = ({ timestamp: '', mobile_quaternion: new Quaternion(0, 0, 0, 1) });
    const recordingTime = route.params.recordingTime || 10;

    const handleSend = () => {
        DeviceMotion.setUpdateInterval(1000 / samplingRate); DeviceMotion.addListener(({ rotation }: DeviceMotionMeasurement) => setEuler(new Euler(rotation.beta as number, rotation.gamma as number, rotation.alpha as number, 'ZXY')))
        setConnected(true);
        setTimeout(() => {
            unsubscribe();
            DeviceMotion.removeAllListeners();
        }, recordingTime * 1000);
    }

    useEffect(() => {
        if (connected) {
            getQuaternion();
            getTimestamp();
            payload.timestamp = timestamp as string;
            payload.mobile_quaternion = quaternion;
            const message = new Paho.Message(JSON.stringify(payload));
            message.destinationName = route.params.topic as string;
            client.send(message);
            setCounter(counter + (1 / route.params.sampleRate!));
        }
    }, [euler])


    const unsubscribe = () => {
        subscribtion && subscribtion.remove();
        setSubscribtion(null);
    }


    function getQuaternion() {
        const newQuaternion: Quaternion = quaternion;
        newQuaternion.setFromEuler(euler);
        setQuaternion(newQuaternion);
    }

    function getTimestamp() {
        const date = new Date();
        setTimestamp(date.toJSON());
    }




    return (
        <View style={[styles.container, { opacity: 1 }]} >
            <Header route={route} navigation={navigation} />
            <Text style={styles.label}>Gyroscope Data</Text>
            <View style={styles.textcontainer} >
                <Text style={styles.label}>x: {quaternion._x} </Text>
                <Text style={styles.label}>y: {quaternion._y} </Text>
                <Text style={styles.label}>z: {quaternion._z} </Text>
                <Text style={styles.label}>w: {quaternion._w} </Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                    <CancelButton navigation={navigation} />

                    <SendButton width={45} text="Send" handleSend={handleSend} />

                </View>

            </View>
            <ProgressBar progress={(counter / recordingTime) * 100} />

        </View>
    );
}