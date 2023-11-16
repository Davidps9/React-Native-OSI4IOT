import { Pressable, Text, TouchableOpacity, View } from "react-native"
import styles from "../Styles/styles";
// import mqtt from "sp-react-native-mqtt";
import Paho from 'paho-mqtt';
import { useEffect, useState } from "react";
import { Gyroscope, GyroscopeMeasurement } from "expo-sensors";
import { Subscription } from "expo-sensors/build/Pedometer";
import { Quaternion } from "../utils/Threejs/Quaternion";
import { Euler } from "../utils/Threejs/Euler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ParamList } from "../types";
import Header from "./Generics/Header";
import CancelButton from "./CancelButton";

type HomeProps = NativeStackScreenProps<ParamList, 'MqttMessagerScreenForGyrosope'>
type Payload = {
    timestamp: string,
    mobile_quaternion: Quaternion

}
// tiene que recibir naviagation y route de homeprops para poder navegar a la siguiente pantalla



export default function Mqtt({ navigation, route }: HomeProps) {

    const [euler, setEuler] = useState<Euler>(new Euler(0, 0, 0, 'XYZ'));
    const [quaternion, setQuaternion] = useState<Quaternion>(new Quaternion(0, 0, 0, 0));

    const client: Paho.Client = route.params.client;

    var message = new Paho.Message(quaternion.toString());
    const [timestamp, setTimestamp] = useState<string>();

    const [subscribtion, setSubscribtion] = useState<Subscription | null>(null);
    var payload: Payload = ({ timestamp: '', mobile_quaternion: new Quaternion(0, 0, 0, 1) });

    const handleSend = () => {
        const samplingRate = route.params.sampleRate || 20;
        Gyroscope.setUpdateInterval(1000 / samplingRate);
        setSubscribtion(Gyroscope.addListener((data: GyroscopeMeasurement) => setEuler(new Euler(data.x, data.y, data.z, 'YXZ'))));

    }

    useEffect(() => {
        if (client.isConnected()) {
            getQuaternion();
            getTimestamp();
            payload = ({ timestamp: timestamp!, mobile_quaternion: quaternion });
            message = new Paho.Message(JSON.stringify(payload));
            message.destinationName = route.params.topic as string;
            client.send(message);

        }
    }, [euler])

    const unsubscribe = () => {
        subscribtion && subscribtion.remove();
        setSubscribtion(null);
    }



    function getQuaternion() {
        let newQuaternion: Quaternion = quaternion;
        newQuaternion.setFromEuler(euler);
        setQuaternion(newQuaternion);
    }

    function getTimestamp() {
        let date = new Date();
        let _timestamp = date.getFullYear().toString() + '-' + date.getMonth().toString() + '-' + date.getDay().toString() + 'T ' + date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString() + date.getMilliseconds() / 1000 + 'Z';
        setTimestamp(_timestamp);
    }

    const onDisconnect = () => {
        unsubscribe();
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

                    <TouchableOpacity onPress={handleSend} style={[styles.button, { width: '45%' }]}  >
                        <Text style={styles.textbutton} >Send</Text>
                    </TouchableOpacity>

                </View>
            </View>

        </View>
    );
}