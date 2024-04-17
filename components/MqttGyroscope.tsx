import { Text, View } from "react-native"
import styles from "../Styles/styles";
import Paho from 'paho-mqtt';
import { useEffect, useState } from "react";
import { DeviceMotion, DeviceMotionMeasurement } from "expo-sensors";
import { Subscription } from "expo-sensors/build/Pedometer";
import { Quaternion } from "../utils/Threejs/Quaternion";
import { Euler } from "../utils/Threejs/Euler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ParamList, PayloadForQuaternion } from "../types";
import Header from "./generics/Header";
import getQuaternion from "../utils/getQuaternion";
import getTimeStamp from "../utils/getTimeStamp";
import Results from "./generics/Results";
import InputFooter from "./generics/InputFooter";
import { unsubscribe } from "../utils/unSubscribe";

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
            unsubscribe({ subscribtion, setSubscribtion });
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



    return (
        <>
            <Header route={route} navigation={navigation} />
            <View style={styles.container} >
                <Text style={styles.label}>Orientation Data</Text>
                <View style={styles.textcontainer} >
                    <Results labels={["QX", "QY", "QZ", "W"]} data={quaternion.toArray()} fixed />
                    <InputFooter HomeProps={{ route, navigation }} handleSend={handleSend} />
                </View>
            </View>
        </>
    );
}