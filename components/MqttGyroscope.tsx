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
import SendButton from "./Generics/SendButton";
import getQuaternion from "../utils/getQuaternion";
import getTimeStamp from "../utils/getTimeStamp";

type HomeProps = NativeStackScreenProps<ParamList, 'MqttMessagerScreenForGyrosope'>


export default function Mqtt({ navigation, route }: HomeProps) {

    const [subscribtion, setSubscribtion] = useState<Subscription | null>(null);
    const [euler, setEuler] = useState<Euler>(new Euler(0, 0, 0, 'YXZ'));
    const [quaternion, setQuaternion] = useState<Quaternion>(new Quaternion(0, 0, 0, 0));
    const [connected, setConnected] = useState<boolean>(false);
    const samplingRate = route.params.sampleRate || 20;
    const client: Paho.Client = route.params.client;
    const [timestamp, setTimestamp] = useState<string>();

    const payload: PayloadForQuaternion = ({ timestamp: '', mobile_quaternion: new Quaternion(0, 0, 0, 1) });
    const recordingTime = route.params.recordingTime || 10;

    const handleSend = () => {
        DeviceMotion.setUpdateInterval(1000 / samplingRate); DeviceMotion.addListener((motion: DeviceMotionMeasurement) => {
            if (motion?.rotation) {
                setEuler(new Euler(motion.rotation.beta as number, motion.rotation.gamma as number, motion.rotation.alpha as number, 'ZXY'))
            }
        })
        setConnected(true);
        setTimeout(() => {
            unsubscribe();
            DeviceMotion.removeAllListeners();
        }, recordingTime * 1000);
    }

    useEffect(() => {
        if (connected) {
            getQuaternion(euler, setQuaternion);
            getTimeStamp(setTimestamp);
            payload.timestamp = timestamp as string;
            payload.mobile_quaternion = quaternion;
            const message = new Paho.Message(JSON.stringify(payload));
            message.destinationName = route.params.topic as string;
            client.send(message);
        }
    }, [euler])


    const unsubscribe = () => {
        subscribtion && subscribtion.remove();
        setSubscribtion(null);
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

        </View>
    );
}